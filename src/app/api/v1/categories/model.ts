import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  name: string;
  organizer: mongoose.Types.ObjectId;
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
      maxLength: [20, 'Panjang nama kategori maksimal 20 karakter'],
      required: [true, 'Nama kategori harus diisi'],
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
  } as any,

  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema);
