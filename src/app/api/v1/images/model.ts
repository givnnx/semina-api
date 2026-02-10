import mongoose from 'mongoose';

export interface IImage extends mongoose.Document {
  name: string;
}

const imageSchema = new mongoose.Schema(
  {
    name: { type: String },
  } as any,
  { timestamps: true }
);

export default mongoose.model<IImage>('Image', imageSchema);
