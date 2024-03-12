import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedStock } from './stock.interfaces';

const createStockBody: Record<keyof NewCreatedStock, any> = {
  product: Joi.string().required(),
  quantity: Joi.number().required(),
};

export const createStock = {
  body: Joi.object().keys(createStockBody),
};

export const getStocks = {
  query: Joi.object().keys({
    product: Joi.string(),
    quantity: Joi.number(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getStock = {
  params: Joi.object().keys({
    stockId: Joi.string().custom(objectId),
  }),
};

export const updateStock = {
  params: Joi.object().keys({
    stockId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      product: Joi.string(),
      quantity: Joi.number(),
    })
    .min(1),
};

export const deleteStock = {
  params: Joi.object().keys({
    stockId: Joi.string().custom(objectId),
  }),
};
