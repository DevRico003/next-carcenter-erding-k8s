import { S3 } from 'aws-sdk';
import handler from '../src/pages/api/emptyTemp';
import { createMocks } from 'node-mocks-http';

jest.mock('aws-sdk', () => {
  const mS3 = { deleteObjects: jest.fn().mockReturnThis(), listObjects: jest.fn().mockReturnThis(), promise: jest.fn() };
  return { S3: jest.fn(() => mS3) };
});

describe('handler', () => {
  test('should delete all files in the bucket when method is POST', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    const mS3Instance = new S3();
    mS3Instance.listObjects().promise.mockResolvedValueOnce({ Contents: [{ Key: 'file1' }, { Key: 'file2' }] });
    mS3Instance.deleteObjects().promise.mockResolvedValueOnce({});

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'All files deleted from the bucket' });
    expect(mS3Instance.listObjects).toBeCalledWith({ Bucket: process.env.AWS_BUCKET_NAME });
    expect(mS3Instance.deleteObjects).toBeCalledWith({
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: [{ Key: 'file1' }, { Key: 'file2' }],
        Quiet: false,
      },
    });
  });

  test('should return 405 when method is not POST', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Method not allowed' });
  });
});