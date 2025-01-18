import { Types } from 'mongoose';

export interface IBookBody {
  title: string;
  author: string;
  publishedYear: number;
  genres: string[];
  stock: number;
  [key: string]: any;
}

export interface BookValidationSchema {
  title: string;
  author: string;
  publishedYear: number;
  genres: string[];
  stock: number;
}
