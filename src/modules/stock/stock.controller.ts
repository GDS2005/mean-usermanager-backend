import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as stockService from './stock.service';

export const createStock = catchAsync(async (req: Request, res: Response) => {
  const stock = await stockService.createStock(req.body);
  res.status(httpStatus.CREATED).send(stock);
});

export const getStocks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await stockService.queryStocks(filter, options);
  res.send(result);
});

export const getStock = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stockId'] === 'string') {
    const stock = await stockService.getStockById(new mongoose.Types.ObjectId(req.params['stockId']));
    if (!stock) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Stock not found');
    }
    res.send(stock);
  }
});

export const updateStock = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stockId'] === 'string') {
    const stock = await stockService.updateStockByProduct(req.params['stockId'], req.body);
    res.send(stock);
  }
});

export const deleteStock = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stockId'] === 'string') {
    await stockService.deleteStockById(new mongoose.Types.ObjectId(req.params['stockId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});