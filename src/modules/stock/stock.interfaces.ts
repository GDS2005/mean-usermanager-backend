import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IStock {
  product: string;
  quantity: number;
}

export interface IStockDoc extends IStock, Document {}

export interface IStockModel extends Model<IStockDoc> {
  isProductTaken(name: string, excludeStockId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type NewCreatedStock = IStock;

export type UpdateStockBody = Partial<IStock>;
