import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IStockDoc, IStockModel } from './stock.interfaces';


const stockSchema = new mongoose.Schema<IStockDoc, IStockModel>(
  {
    product: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

stockSchema.static('isProductTaken', async function (product: string, excludeStockId: mongoose.ObjectId): Promise<boolean> {
  const stock = await this.findOne({ product, _id: { $ne: excludeStockId } });
  return !!stock;
});

stockSchema.pre('save', async function (next) {
  next();
});

const Stock = mongoose.model<IStockDoc, IStockModel>('Stock', stockSchema);

export default Stock;