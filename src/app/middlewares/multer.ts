import crypto from "crypto";
import multer from "multer";
import { Request } from "express";
import { BadRequestError } from "../errors";

const MIME_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, "public/uploads/");
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const ext = MIME_MAP[file.mimetype] || ".jpg";
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (MIME_MAP[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Unsupported file format. Only JPEG, PNG, and WebP images are allowed.",
      ),
    );
  }
};

const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 3000000,
  },
  fileFilter: fileFilter,
});

export default uploadMiddleware;
