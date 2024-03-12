import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Stock from './stock.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedStock, UpdateStockBody, IStockDoc } from './stock.interfaces';

/**
 * Create a stock
 * @param {NewCreatedStock} stockBody
 * @returns {Promise<IStockDoc>}
 */
export const createStock = async (stockBody: NewCreatedStock): Promise<IStockDoc> => {
  if (await Stock.isProductTaken(stockBody.product)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stock already exist');
  }
  return Stock.create(stockBody);
};

/**
 * Query for stocks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryStocks = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const stocks = await Stock.paginate(filter, options);
  return stocks;
};

/**
 * Get stock by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IStockDoc | null>}
 */
export const getStockById = async (id: mongoose.Types.ObjectId): Promise<IStockDoc | null> => Stock.findById(id);

export const getStockByProduct = async (product: string): Promise<IStockDoc | null> => {
  return Stock.findOne({ product: product });
};

/**
 * Update stock by id
 * @param {mongoose.Types.ObjectId} stockId
 * @param {UpdateStockBody} updateBody
 * @returns {Promise<IStockDoc | null>}
 */
export const updateStockById = async (
  stockId: mongoose.Types.ObjectId,
  updateBody: UpdateStockBody
): Promise<IStockDoc | null> => {
  const stock = await getStockById(stockId);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock not found.');
  }
  if (updateBody.product && (await Stock.isProductTaken(updateBody.product, stockId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken.');
  }
  Object.assign(stock, updateBody);
  await stock.save();
  return stock;
};

export const updateStockByProduct = async (product: string, update: any): Promise<IStockDoc | null> => {
  try {
    // Find the stock by product and update it
    const stock = await Stock.findOneAndUpdate({ product }, update, { new: true });
    return stock;
  } catch (error) {
    throw new Error('Error updating stock by product');
  }
};

/**
 * Delete stock by id
 * @param {mongoose.Types.ObjectId} stockId
 * @returns {Promise<IStockDoc | null>}
 */
export const deleteStockById = async (stockId: mongoose.Types.ObjectId): Promise<IStockDoc | null> => {
  const stock = await getStockById(stockId);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stock not found');
  }
  await stock.deleteOne();
  return stock;
};

export const deleteStockByProduct = async (product: string): Promise<IStockDoc | null> => {
  const stock = await getStockByProduct(product); 
  if (!stock) {
    throw new Error('Stock not found');
  }
  await stock.deleteOne(); 
  return stock;
};