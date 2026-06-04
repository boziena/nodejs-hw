import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const url = process.env.MONGO_URL;
    if (!url) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }
    await mongoose.connect(url);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.error('Error while setting up mongo connection:', e);
    throw e;
  }
};
