import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { stockController, stockValidation } from '../../modules/stock';

const router: Router = express.Router();
/* First autenticate the roles. Then, validate the values. Last, call to the function */
router
  .route('/')
  .post(auth('manageStocks'), validate(stockValidation.createStock), stockController.createStock)
  .get(auth('getStocks'), validate(stockValidation.getStocks), stockController.getStocks);

router
  .route('/:stockId')
  .get(auth('getStocks'), validate(stockValidation.getStock), stockController.getStock)
  .patch(auth('manageStocks'), validate(stockValidation.updateStock), stockController.updateStock)
  .delete(auth('manageStocks'), validate(stockValidation.deleteStock), stockController.deleteStock);

export default router;