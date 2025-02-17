import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@smithy/util-stream';
import { Readable } from 'stream';

import { expect } from 'chai';
import { ArgumentError } from 'auth0-extension-tools';

import { S3StorageContext } from '../../../server/lib/tools/s3-storage-context';

describe('S3 Storage Context', () => {
  const redirectErrorCodes = [
    'AuthorizationHeaderMalformed',
    'BadRequest',
    'PermanentRedirect',
    301
  ];

  describe('constructor', () => {
    it('should throw error if options are not provided', () => {
      try {
        new S3StorageContext();
        throw new Error('should fail');
      } catch (error) {
        expect(error).to.be.an.instanceof(ArgumentError);
        expect(error.message).to.equal('The \'options\' object is required when configuring the S3StorageContext.');
      }
    });

    it('should throw error if options.path is not provided', () => {
      try {
        new S3StorageContext({});
        throw new Error('should fail');
      } catch (error) {
        expect(error).to.be.an.instanceof(ArgumentError);
        expect(error.message).to.equal('The \'path\' property is required when configuring the S3StorageContext.');
      }
    });

    it('should throw error if options.bucket is not provided', () => {
      try {
        new S3StorageContext({
          path: '/test.json'
        });
        throw new Error('should fail');
      } catch (error) {
        expect(error).to.be.an.instanceof(ArgumentError);
        expect(error.message).to.equal('The \'bucket\' property is required when configuring the S3StorageContext.');
      }
    });

    it('should throw error if options.keyId is not provided', () => {
      try {
        new S3StorageContext({
          path: '/test.json',
          bucket: 'foobar'
        });
        throw new Error('should fail');
      } catch (error) {
        expect(error).to.be.an.instanceof(ArgumentError);
        expect(error.message).to.equal('The \'keyId\' property is required when configuring the S3StorageContext.');
      }
    });

    it('should throw error if options.keySecret is not provided', () => {
      try {
        new S3StorageContext({
          path: '/test.json',
          bucket: 'foobar',
          keyId: 'my-key'
        });
        throw new Error('should fail');
      } catch (error) {
        expect(error).to.be.an.instanceof(ArgumentError);
        expect(error.message).to.equal('The \'keySecret\' property is required when configuring the S3StorageContext.');
      }
    });
  });

  describe('read data', () => {
    const storedData = { foo: 'bar' };
    const defaultData = { bar: 'baz' };

    it('successfully returns stored data ', async () => {
      const s3Mock = mockClient(S3Client);
      s3Mock.on(GetObjectCommand).resolves({ Body: toStream(storedData) });

      const s3StorageContext = new S3StorageContext({
        path: '/test.json',
        bucket: 'foobar',
        keyId: 'my-key',
        keySecret: 'my-secret',
        defaultData: defaultData
      });

      const result = await s3StorageContext.read();
      expect(result).to.deep.equal(storedData);
    });

    it('returns defaultData if bucket does not exist ', async () => {
      const s3Mock = mockClient(S3Client);

      const error = new Error('test aws error');
      error.Code = 'NoSuchKey';

      s3Mock.on(GetObjectCommand).rejects(error);

      const s3StorageContext = new S3StorageContext({
        path: '/test.json',
        bucket: 'foobar',
        keyId: 'my-key',
        keySecret: 'my-secret',
        defaultData: defaultData
      });

      const result = await s3StorageContext.read();
      expect(result).to.deep.equal(defaultData);
    });

    it('returns defaultData if data from s3 is null', async () => {
      const s3Mock = mockClient(S3Client);
      s3Mock.on(GetObjectCommand).resolves(null);

      const s3StorageContext = new S3StorageContext({
        path: '/test.json',
        bucket: 'foobar',
        keyId: 'my-key',
        keySecret: 'my-secret',
        defaultData: defaultData
      });

      const result = await s3StorageContext.read();
      expect(result).to.deep.equal(defaultData);
    });

    describe('redirect error', () => {
      redirectErrorCodes.map(errorCode => {
        it(`should handle region redirect properly when errorCode = ${errorCode}`, async () => {
          const s3Mock = mockClient(S3Client);

          const s3Error = new Error('test aws error');
          s3Error.Code = errorCode;
          s3Error.$response = { headers: { 'x-amz-bucket-region': 'correct-region' } };

          s3Mock.on(GetObjectCommand)
            .rejectsOnce(s3Error) // first request fails with redirect error
            .resolvesOnce({ Body: toStream(storedData) }); // second request returns data

          const s3StorageContext = new S3StorageContext({
            path: '/test.json',
            bucket: 'foobar',
            keyId: 'my-key',
            keySecret: 'my-secret',
            defaultData: defaultData
          });

          const result = await s3StorageContext.read();
          expect(result).to.deep.equal(storedData);
        });

        it(`does not redirect when no region in response headers and errorCode = ${errorCode}`, async () => {
          const s3Mock = mockClient(S3Client);

          const s3Error = new Error('test aws error');
          s3Error.Code = errorCode;
          s3Error.$response = { headers: {} };
          s3Mock.on(GetObjectCommand).rejects(s3Error);

          const s3StorageContext = new S3StorageContext({
            path: '/test.json',
            bucket: 'foobar',
            keyId: 'my-key',
            keySecret: 'my-secret'
          });

          try {
            await s3StorageContext.read();
            throw new Error('should never happen');
          } catch (error) {
            expect(error).to.equal(s3Error);
          }
        });
      });
    });
  });

  describe('write data', () => {
    const dataToWrite = { foo: 'bar' };

    it('successfully writes data ', async () => {
      let uploadedData = null;

      const s3Mock = mockClient(S3Client);
      s3Mock.on(PutObjectCommand).callsFake(async (input) => {
        uploadedData = input;
        return {};
      });

      const s3StorageContext = new S3StorageContext({
        path: '/test.json',
        bucket: 'foobar',
        keyId: 'my-key',
        keySecret: 'my-secret'
      });

      await s3StorageContext.write(dataToWrite);

      expect(JSON.parse(uploadedData.Body)).to.deep.equal(dataToWrite);
      expect(uploadedData.Bucket).to.equal('foobar');
      expect(uploadedData.Key).to.equal('/test.json');
    });

    describe('redirect error', () => {
      redirectErrorCodes.map(errorCode => {
        it(`should handle region redirect properly when errorCode = ${errorCode}`, async () => {
          let uploadedData = null;

          const s3Mock = mockClient(S3Client);

          const s3Error = new Error('test aws error');
          s3Error.Code = errorCode;
          s3Error.$response = { headers: { 'x-amz-bucket-region': 'correct-region' } };

          s3Mock.on(PutObjectCommand)
            .rejectsOnce(s3Error) // first request fails with redirect error
            .callsFakeOnce(async (input) => {  // second request returns data
              uploadedData = input;
              return {};
            });

          const s3StorageContext = new S3StorageContext({
            path: '/test.json',
            bucket: 'foobar',
            keyId: 'my-key',
            keySecret: 'my-secret'
          });

          await s3StorageContext.write(dataToWrite);

          expect(JSON.parse(uploadedData.Body)).to.deep.equal(dataToWrite);
          expect(uploadedData.Bucket).to.equal('foobar');
          expect(uploadedData.Key).to.equal('/test.json');
        });

        it(`does not redirect when no region in response headers and errorCode = ${errorCode}`, async () => {
          const s3Mock = mockClient(S3Client);

          const s3Error = new Error('test aws error');
          s3Error.Code = errorCode;
          s3Error.$response = { headers: {} };

          s3Mock.on(PutObjectCommand).rejectsOnce(s3Error);

          const s3StorageContext = new S3StorageContext({
            path: '/test.json',
            bucket: 'foobar',
            keyId: 'my-key',
            keySecret: 'my-secret'
          });

          try {
            await s3StorageContext.write(dataToWrite);
            throw new Error('should never happen');
          } catch (error) {
            expect(error).to.equal(s3Error);
          }
        });
      });
    });
  });
});

function toStream(metadata) {
  const stream = new Readable();
  stream.push(JSON.stringify(metadata));
  stream.push(null); // end of stream
  return sdkStreamMixin(stream);
}
