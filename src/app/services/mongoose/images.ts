import Images from "../../api/v1/images/model";
import { NotFoundError } from "../../errors";
import { Request } from "express";

const createImages = async (req: Request) => {
  const result = await Images.create({
    name: req.file
      ? `uploads/${req.file.filename}`
      : "uploads/avatar/default.jpeg",
  });

  return result;
};

const checkingImage = async (id: string) => {
  const result = await Images.findOne({ _id: id });
  console.log(result);

  if (!result) throw new NotFoundError(`Tidak ada Gambar dengan id :  ${id}`);

  return result;
};

export { createImages, checkingImage };
