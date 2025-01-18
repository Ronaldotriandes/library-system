import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BookRouter from '../src/collections/book/router';
import { errorHandler } from './middleware/errorHadler';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { limiter, paramProtection } from './middleware/security';
import config from './config/config';
// @ts-ignore
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(helmet()); // Security headers

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || config.mongodb.url;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express TypeScript API' });
});
app.use('/api', limiter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/books', BookRouter);

app.use(mongoSanitize()); // NoSQL injection prevention
app.use(paramProtection); // Parameter pollution protection

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server`,
  });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
// Start server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

export default app;
