import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Product from './product.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedProduct, UpdateProductBody, IProductDoc } from './product.interfaces';
//import { NewCreatedStock, IStockDoc } from '../stock/stock.interfaces';
//import { Stock } from '../stock';

/**
 * Create a product
 * @param {NewCreatedProduct} productBody
 * @returns {Promise<IProductDoc>}
 */
export const createProduct = async (productBody: NewCreatedProduct): Promise<IProductDoc> => {
  if (await Product.isNameTaken(productBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already exists');
  }

  return Product.create(productBody);
  
  /*
  const stockData: NewCreatedStock = {
    product: product._id,
    quantity: 0
  };
  
  const stock = await Stock.create(stockData);
  
  return product;
  */
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryProducts = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IProductDoc | null>}
 */
export const getProductById = async (id: mongoose.Types.ObjectId): Promise<IProductDoc | null> => Product.findById(id);

/**
 * Update product by id
 * @param {mongoose.Types.ObjectId} productId
 * @param {UpdateProductBody} updateBody
 * @returns {Promise<IProductDoc | null>}
 */
export const updateProductById = async (
  productId: mongoose.Types.ObjectId,
  updateBody: UpdateProductBody
): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
  }
  if (updateBody.name && (await Product.isNameTaken(updateBody.name, productId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken.');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {mongoose.Types.ObjectId} productId
 * @returns {Promise<IProductDoc | null>}
 */
export const deleteProductById = async (productId: mongoose.Types.ObjectId): Promise<IProductDoc | null> => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.deleteOne();
  return product;
};
