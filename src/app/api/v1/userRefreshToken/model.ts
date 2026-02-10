import mongoose from 'mongoose';

export interface IUserRefreshToken extends mongoose.Document {
  refreshToken: string;
  user: mongoose.Types.ObjectId;
}

const userRefreshTokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  } as any,
  { timestamps: true }
);

export default mongoose.model<IUserRefreshToken>('UserRefreshToken', userRefreshTokenSchema);
