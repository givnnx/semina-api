import mongoose from 'mongoose';

export interface IOrderDetail {
  ticketCategories: {
    type: string;
    price: number;
  };
  sumTicket: number;
}

export interface IOrder extends mongoose.Document {
  date: Date;
  personalDetail: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  status: 'pending' | 'paid';
  totalPay: number;
  totalOrderTicket: number;
  orderItems: IOrderDetail[];
  participant: mongoose.Types.ObjectId;
  payment: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  historyEvent: {
    title: string;
    date: Date;
    about: string;
    tagline: string;
    keyPoint: string[];
    venueName: string;
    image: mongoose.Types.ObjectId;
    category: mongoose.Types.ObjectId;
    talent: mongoose.Types.ObjectId;
    organizer: mongoose.Types.ObjectId;
  };
}

const orderDetailSchema = new mongoose.Schema({
  ticketCategories: {
    type: {
      type: String,
      required: [true, 'Tipe tiket harus diisi'],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  sumTicket: {
    type: Number,
    required: true,
  },
} as any);

const orderSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    personalDetail: {
      firstName: {
        type: String,
        required: [true, 'Please provide firstName'],
        minlength: 3,
        maxlength: 50,
      },
      lastName: {
        type: String,
        required: [true, 'Please provide lastName'],
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
      },
      role: {
        type: String,
        default: 'Designer',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    totalPay: {
      type: Number,
      required: true,
    },
    totalOrderTicket: {
      type: Number,
      required: true,
    },
    orderItems: [orderDetailSchema],
    participant: {
      type: mongoose.Types.ObjectId,
      ref: 'Participant',
      required: true,
    },
    payment: {
      type: mongoose.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    historyEvent: {
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
    },
  } as any,
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
