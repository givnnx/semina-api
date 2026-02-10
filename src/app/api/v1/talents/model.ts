import mongoose from "mongoose";

export interface ITalent extends mongoose.Document {
  name: string;
  role: string;
  image: mongoose.Types.ObjectId;
  organizer: mongoose.Types.ObjectId;
}

const talentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
    },
    role: {
      type: String,
      default: "-",
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  } as any,
  { timestamps: true },
);

export default mongoose.model<ITalent>("Talent", talentSchema);
