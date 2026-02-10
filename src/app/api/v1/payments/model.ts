import mongoose from 'mongoose';

export interface IPayment extends mongoose.Document {
  type: string;
  image: mongoose.Types.ObjectId;
  status: boolean;
  organizer: mongoose.Types.ObjectId;
}

const PaymentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Tipe pembayaran harus diisi'],
      minlength: 3,
      maxlength: 50,
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
  } as any,
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
