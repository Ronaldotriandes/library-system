import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  publishedYear: number;
  genres: string[];
  stock: number;
  createdAt: Date;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  genres: [{ type: String }],
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBook>('Book', BookSchema);
