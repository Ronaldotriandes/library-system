import express, { NextFunction, RequestHandler, Router } from 'express';
import Joi from 'joi';
import controller from './controller';
import { BookValidationSchema } from './dto';
import Book from './schema';
const router: Router = express.Router();

// Define validation schema
const bookVAlidate = Joi.object<BookValidationSchema>({
  title: Joi.string().required(),
  author: Joi.string().required(),
  genres: Joi.array().items(Joi.string()).min(1).required(),
  publishedYear: Joi.number().required(),
  stock: Joi.number().required(),
});
const bookVAlidateUpdate = Joi.object<BookValidationSchema>({
  title: Joi.string(),
  author: Joi.string(),
  genres: Joi.array().items(Joi.string()).min(1),
  publishedYear: Joi.number(),
  stock: Joi.number(),
});
const validateBookCreate: RequestHandler = (req, res, next) => {
  const { error } = bookVAlidate.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    res.status(400).json({
      status: false,
      message: 'Error Validation',
      errors,
    });
  }
  next();
};

const validateBookUpdate: RequestHandler = (req, res, next) => {
  const { error } = bookVAlidateUpdate.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    res.status(400).json({
      status: false,
      message: 'Error Validation',
      errors,
    });
  }
  next();
};
// Routes
router.get('/', controller.getAllData);

router.post('/', validateBookCreate, controller.save);

router.get('/:id', controller.getById);

router.put('/:id', validateBookUpdate, controller.update);

router.delete('/:id', controller.delete);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publishedYear
 *         - genres
 *         - stock
 *       properties:
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         publishedYear:
 *           type: number
 *           description: Year the book was published
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: Book genres
 *         stock:
 *           type: number
 *           description: Available stock
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalBooks:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     page:
 *                       type: number
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *
 *   put:
 *     summary: Update book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *
 *   delete:
 *     summary: Delete book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
