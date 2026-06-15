import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI environment variable is not defined in .env');
  process.exit(1);
}

const options = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

let retryCount = 0;
const MAX_RETRIES = 5;

export const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, options);
    console.log('Successfully connected to MongoDB Atlas.');
    retryCount = 0; // Reset retries on successful connection
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    retryCount++;
    if (retryCount <= MAX_RETRIES) {
      console.log(`Retrying connection (${retryCount}/${MAX_RETRIES}) in 5 seconds...`);
      setTimeout(connectDB, 5000);
    } else {
      console.error('Failed to connect to MongoDB Atlas after maximum retries. Exiting...');
      process.exit(1);
    }
  }
};

// Monitor Connection States
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection status: CONNECTED');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection status: DISCONNECTED');
});

// Close Mongoose connection on process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection closed through app termination (SIGINT)');
    process.exit(0);
  } catch (err) {
    console.error(`Error during Mongoose connection closure: ${err}`);
    process.exit(1);
  }
});

export default connectDB;
