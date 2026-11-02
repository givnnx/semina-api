import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IParticipant extends mongoose.Document {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: string;
  status: 'aktif' | 'tidak aktif';
  otp?: string;
  otpExpiresAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const participantSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Nama depan harus diisi'],
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email harus diisi'],
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: 6,
    },
    role: {
      type: String,
      default: '-',
    },
    status: {
      type: String,
      enum: ['aktif', 'tidak aktif'],
      default: 'tidak aktif',
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

participantSchema.pre<IParticipant>('save', async function (next) {
  const User = this as unknown as IParticipant;
  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

participantSchema.methods.comparePassword = async function (canditatePassword: string) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export default mongoose.model<IParticipant>('Participant', participantSchema);

