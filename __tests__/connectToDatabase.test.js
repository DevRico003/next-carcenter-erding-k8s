import connectToDatabase from '../src/utils/connectToDatabase';
import mongoose from 'mongoose';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 0, // default state to "disconnected"
  },
}));

describe('connectToDatabase', () => {
  // Reset the mock before each test
  beforeEach(() => {
    mongoose.connect.mockClear();
    mongoose.connection.readyState = 0; // You might also want to reset this before each test
  });

  it('should connect to the database if not already connected', async () => {
    const uri = 'your_mongodb_uri'; // This should match your actual env variable value for testing
    process.env.MONGODB_URI = uri;
    
    await connectToDatabase();
    
    expect(mongoose.connect).toHaveBeenCalledWith(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it('should not attempt to connect if already connected', async () => {
    // Simulate an already established connection by setting readyState to 1
    mongoose.connection.readyState = 1;
    
    await connectToDatabase();
    
    // Since the connection state is simulated as already connected, mongoose.connect should not be called
    expect(mongoose.connect).not.toHaveBeenCalled();
  });
});