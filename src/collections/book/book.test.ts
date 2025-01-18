import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../server';
import { Server } from 'http';

describe('Book API Integration Tests', () => {
  let mongoServer: MongoMemoryServer;
  let bookId: string;
  let server: Server;

  const testBook = {
    title: 'Test Book',
    author: 'Test Author',
    genres: ['Fiction'],
    publishedYear: 2023,
    stock: 10,
  };

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    server = app.listen(); // Create server instance
  });

  afterAll(async () => {
    await mongoose.connection.close(true);
    await mongoServer.stop({ doCleanup: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const response = await request(app).post('/api/books').send(testBook);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(testBook.title);
      bookId = response.body.data._id;
    });

    it('should validate required fields', async () => {
      const response = await request(app).post('/api/books').send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/books', () => {
    afterEach(async () => {
      await mongoose.connection.dropDatabase();
    });
    beforeEach(async () => {
      await request(app).post('/api/books').send(testBook);
    });

    it('should get all books', async () => {
      const response = await request(app).get('/api/books');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter books by search term', async () => {
      const response = await request(app).get('/api/books').query({ search: 'Test Book' });

      expect(response.status).toBe(200);
      expect(response.body.data[0].title).toBe('Test Book');
    });
  });

  describe('GET /api/books/:id', () => {
    beforeEach(async () => {
      const response = await request(app).post('/api/books').send(testBook);
      bookId = response.body.data._id;
    });

    it('should get book by id', async () => {
      const response = await request(app).get(`/api/books/${bookId}`);
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(testBook.title);
    });

    it('should return 404 for non-existent book', async () => {
      const response = await request(app).get(`/api/books/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/books/:id', () => {
    beforeEach(async () => {
      const response = await request(app).post('/api/books').send(testBook);
      bookId = response.body.data._id;
    });

    it('should update book', async () => {
      const updateData = { title: 'Updated Book Title' };
      const response = await request(app).put(`/api/books/${bookId}`).send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updateData.title);
    });
  });

  describe('DELETE /api/books/:id', () => {
    beforeEach(async () => {
      const response = await request(app).post('/api/books').send(testBook);
      bookId = response.body.data._id;
    });

    it('should delete book', async () => {
      const response = await request(app).delete(`/api/books/${bookId}`);
      expect(response.status).toBe(200);

      const getResponse = await request(app).get(`/api/books/${bookId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
