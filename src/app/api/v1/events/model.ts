import mongoose from 'mongoose';

interface ITicketCategory {
  type: string;
  price: number;
  stock: number;
  statusTicketCategories: boolean;
  expired: Date;
}

export interface IEvent extends mongoose.Document {
  title: string;
  date: Date;
  about: string;
  tagline: string;
  keyPoint: string[];
  venueName: string;
  statusEvent: 'Draft' | 'Published';
  tickets: ITicketCategory[];
  image: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  talent: mongoose.Types.ObjectId;
  organizer: mongoose.Types.ObjectId;
}

const ticketCategoriesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Tipe tiket harus diisi'],
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  statusTicketCategories: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },
  expired: {
    type: Date,
  },
} as any);

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul harus diisi'],
      minlength: 3,
      maxlength: 50,
    },
    date: {
      type: Date,
      required: [true, 'Tanggal dan waktu harus diisi'],
    },
    about: {
      type: String,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline harus diisi'],
    },
    keyPoint: {
      type: [String],
    },
    venueName: {
      type: String,
      required: [true, 'Tempat acara harus diisi'],
    },
    statusEvent: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    tickets: {
      type: [ticketCategoriesSchema],
      required: true,
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    talent: {
      type: mongoose.Types.ObjectId,
      ref: 'Talent',
      required: true,
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
  } as any,
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
