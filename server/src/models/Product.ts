import { Schema, model, type InferSchemaType } from 'mongoose';

const colorSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Outerwear', 'Tops', 'Knitwear', 'Bottoms', 'Shirts'],
    },
    brand: { type: String, required: true, enum: ['UrbanCart', 'TrendWear', 'ClassicFit', 'ActiveGear'] },
    sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL'], required: true }],
    colors: { type: [colorSchema], default: [] },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    stock: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ProductDocument = InferSchemaType<typeof productSchema> & { _id: unknown };
export const Product = model('Product', productSchema);
