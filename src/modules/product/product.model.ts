import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IProductDoc, IProductModel } from './product.interfaces';


const productSchema = new mongoose.Schema<IProductDoc, IProductModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
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
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.static('isNameTaken', async function (name: string, excludeProductId: mongoose.ObjectId): Promise<boolean> {
  const product = await this.findOne({ name, _id: { $ne: excludeProductId } });
  return !!product;
});

productSchema.pre('save', async function (next) {
  next();
});

const Product = mongoose.model<IProductDoc, IProductModel>('Product', productSchema);

export default Product;