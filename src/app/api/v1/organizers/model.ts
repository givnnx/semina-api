import mongoose from 'mongoose';

export interface IOrganizer extends mongoose.Document {
  organizer: string;
}

const organizersSchema = new mongoose.Schema(
  {
    organizer: {
      type: String,
      required: [true, 'Peyelenggara harus diisi'],
    },
  } as any,
  { timestamps: true }
);

export default mongoose.model<IOrganizer>('Organizer', organizersSchema);
