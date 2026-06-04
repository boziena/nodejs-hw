import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const url = process.env.MONGO_URL;
    if (!url) {
      throw new Error('MONGO_URL is not defined');
    }
    await mongoose.connect(url);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.error('Database connection failed:', e);
    throw e;
  }
};
