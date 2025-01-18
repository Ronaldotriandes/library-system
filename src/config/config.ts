import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/library',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

export default config;
