import nock from 'nock';
import { expect } from 'chai';

import config from '../../../server/lib/config';

import { setConfig } from '../../utils';
import managementApiClient from '../../../server/lib/ManagementApiClient';

describe('managementApiClient', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  describe('#getAccessToken', () => {
    it('should return an error in case of network issues', (done) => {
      setConfig({
        AUTH0_DOMAIN: 'this.domain.does.not.ex.ist',
        AUTH0_CLIENT_ID: '111',
        AUTH0_CLIENT_SECRET: '222'
      });

      managementApiClient.getAccessToken(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
        .catch((err) => {
          expect(err.name).to.be.equal('RequestError');
          done();
        });
    });

    it('should return error if unauthorized', (done) => {
      const settings = {
        AUTH0_DOMAIN: 'tenant.auth0.com',
        AUTH0_CLIENT_ID: 'client1',
        AUTH0_CLIENT_SECRET: 'mySecret'
      };
      setConfig(settings);

      nock(`https://${settings.AUTH0_DOMAIN}`)
        .post('/oauth/token', {
          audience: `https://${settings.AUTH0_DOMAIN}/api/v2/`,
          grant_type: 'client_credentials',
          client_id: settings.AUTH0_CLIENT_ID,
          client_secret: settings.AUTH0_CLIENT_SECRET
        })
        .reply(401);

      managementApiClient.getAccessToken(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
        .catch((err) => {
          expect(err.statusCode).to.equal(401);
          done();
        });
    });

    it('should return access token if authorized', (done) => {
      const settings = {
        AUTH0_DOMAIN: 'tenant.auth0.com',
        AUTH0_CLIENT_ID: 'client1',
        AUTH0_CLIENT_SECRET: 'mySecret'
      };
      setConfig(settings);

      nock(`https://${settings.AUTH0_DOMAIN}`)
        .post('/oauth/token', {
          audience: `https://${settings.AUTH0_DOMAIN}/api/v2/`,
          grant_type: 'client_credentials',
          client_id: settings.AUTH0_CLIENT_ID,
          client_secret: settings.AUTH0_CLIENT_SECRET
        })
        .reply(200, {
          access_token: 'abc'
        });

      managementApiClient.getAccessToken(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
        .then((accessToken) => {
          expect(accessToken).to.equal('abc');
          done();
        });
    });
  });

  describe('#getForAccessToken', () => {
    it('should return a ManagementClient with the access token', (done) => {
      setConfig({
        AUTH0_DOMAIN: 'this.domain.does.not.ex.ist',
        AUTH0_CLIENT_ID: '111',
        AUTH0_CLIENT_SECRET: '222'
      });

      managementApiClient.getForAccessToken('tenant.auth0.com', 'abcdefg')
        .then(managementClient => {
          expect(managementClient).not.to.be.null;
          done();
        });
    });
  });
});
