import dotenv from "dotenv";
dotenv.config();

export const urlDb = process.env.URL_MONGODB_DEV as string;
export const jwtSecret = process.env.JWT_SECRET as string;
export const jwtRefreshTokenSecret = process.env
  .JWT_SECRET_REFRESH_TOKEN as string;
export const jwtExpiration = "2h";
export const jwtRefreshTokenExpiration = "24h";
export const gmail = process.env.GMAIL;
export const password = process.env.PASSWORD;
