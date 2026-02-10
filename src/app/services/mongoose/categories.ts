// import model categories
import Categories from "../../api/v1/categories/model";
import { Request } from "express";

import { NotFoundError, BadRequestError } from "../../errors";

const getAllCategories = async (req: Request) => {
  let condition = { organizer: (req as any).user.organizer };

  const result = await Categories.find(condition);

  return result;
};

const createCategories = async (req: Request) => {
  const { name } = req.body;

  const check = await Categories.findOne({
    name,
    organizer: (req as any).user.organizer,
  });

  if (check) throw new BadRequestError("kategori nama duplikat");

  const result = await Categories.create({
    name,
    organizer: (req as any).user.organizer,
  });

  return result;
};

const getOneCategories = async (req: Request) => {
  const { id } = req.params;

  const result = await Categories.findOne({
    _id: id,
    organizer: (req as any).user.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  return result;
};

const updateCategories = async (req: Request) => {
  const { id } = req.params;
  const { name } = req.body;

  const check = await Categories.findOne({
    name,
    organizer: (req as any).user.organizer,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("kategori nama duplikat");

  const result = await Categories.findOneAndUpdate(
    { _id: id },
    { name, organizer: (req as any).user.organizer },
    { new: true, runValidators: true },
  );

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  return result;
};

const deleteCategories = async (req: Request) => {
  const { id } = req.params;

  const result = await Categories.findOne({
    _id: id,
    organizer: (req as any).user.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  await result.deleteOne();

  return result;
};

const checkingCategories = async (id: string) => {
  const result = await Categories.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id :  ${id}`);

  return result;
};

export {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
  checkingCategories,
};
