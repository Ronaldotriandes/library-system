import moment from 'moment';
import Book from './schema';
import { IBookBody } from './dto';
import { NotFoundError } from '../../lib/error';

interface IQuery {
  page?: string | number;
  limit?: string | number;
  search?: string;
  [key: string]: any;
}

export class BookService {
  public async getAllData(query: IQuery) {
    const searchQuery = query.search || '';
    const page: number = parseInt(query.page as string) || 1;
    const limit: number = parseInt(query.limit as string) || 10;
    const matchStage = searchQuery
      ? {
          $match: {
            $or: [
              { title: { $regex: `.*${searchQuery}.*`, $options: 'i' } },
              { author: { $regex: `.*${searchQuery}.*`, $options: 'i' } },
            ],
          },
        }
      : { $match: {} };
    const data = await Book.aggregate([matchStage], { allowDiskUse: true })
      .allowDiskUse(true)
      .collation({ locale: 'en', strength: 2 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Book.countDocuments();

    return {
      data: data,
      meta: {
        totalBooks: total,
        totalPages: Math.ceil(total / limit),
        page,
      },
    };
  }

  public async saveData(body: IBookBody) {
    const data = await Book.create(body);
    return data;
  }

  public async findById(id: string) {
    const result: IBookBody | null = await Book.findById(id);
    if (!result) {
      throw new NotFoundError('ID Not Found');
    }
    return result;
  }

  public async deleteById(id: string) {
    const data = await Book.findByIdAndDelete(id);
    if (!data) {
      throw new NotFoundError('ID Not Found');
    }
    return data;
  }

  public async update(id: string, body: Partial<IBookBody>) {
    const data = await Book.findByIdAndUpdate(id, { $set: body }, { new: true });
    return data;
  }
}

export default new BookService();
