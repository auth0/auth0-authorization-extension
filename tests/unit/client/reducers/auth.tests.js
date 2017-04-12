import url from 'url';
import expect from 'expect';
import { auth } from '../../../client/reducers/auth';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  isAuthenticated: false,
  isAuthenticating: false,
  issuer: null,
  token: null,
  decodedToken: null,
  user: null
};

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(
      auth(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle LOGIN_PENDING', () => {
    expect(
      auth(initialState, {
        type: constants.LOGIN_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        isAuthenticated: false,
        isAuthenticating: true,
        issuer: null,
        token: null,
        decodedToken: null,
        user: null
      }
    );
  });

  it('should handle LOGIN_FAILED with error payload', () => {
    expect(
      auth(initialState, {
        type: constants.LOGIN_FAILED,
        payload: { error: 'forbidden' }
      }).toJSON()
    ).toEqual(
      {
        error: 'forbidden',
        isAuthenticated: false,
        isAuthenticating: false,
        issuer: null,
        token: null,
        decodedToken: null,
        user: null
      }
    );
  });

  it('should handle LOGIN_FAILED without error payload', () => {
    expect(
      auth(initialState, {
        type: constants.LOGIN_FAILED,
        payload: { }
      }).toJSON()
    ).toEqual(
      {
        error: 'Unknown Error',
        isAuthenticated: false,
        isAuthenticating: false,
        issuer: null,
        token: null,
        decodedToken: null,
        user: null
      }
    );
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(
      auth(initialState, {
        type: constants.LOGIN_SUCCESS,
        payload: {
          user: { name: 'test' },
          token: 'test token',
          decodedToken: {
            iss: 'https://roman-test.eu.auth0.com/'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        isAuthenticated: true,
        isAuthenticating: false,
        issuer: url.parse('https://roman-test.eu.auth0.com/').hostname,
        token: 'test token',
        decodedToken: {
          iss: 'https://roman-test.eu.auth0.com/'
        },
        user: { name: 'test' }
      }
    );
  });

  it('should handle LOGOUT_SUCCESS', () => {
    expect(
      auth(initialState, {
        type: constants.LOGOUT_SUCCESS
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
