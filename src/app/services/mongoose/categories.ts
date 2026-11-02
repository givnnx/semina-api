// import model categories
import Categories from "../../api/v1/categories/model";
import { Request } from "express";
import { CustomRequest } from "../../middlewares/auth";

import { NotFoundError, BadRequestError } from "../../errors";

const getAllCategories = async (req: Request) => {
  const user = (req as CustomRequest).user;
  const condition = { organizer: user?.organizer };

  const result = await Categories.find(condition);

  return result;
};

const createCategories = async (req: Request) => {
  const { name } = req.body;

  const check = await Categories.findOne({
    name,
    organizer: (req as CustomRequest).user?.organizer,
  });

  if (check) throw new BadRequestError("kategori nama duplikat");

  const result = await Categories.create({
    name,
    organizer: (req as CustomRequest).user?.organizer,
  });

  return result;
};

const getOneCategories = async (req: Request) => {
  const { id } = req.params;

  const result = await Categories.findOne({
    _id: id,
    organizer: (req as CustomRequest).user?.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  return result;
};

const updateCategories = async (req: Request) => {
  const { id } = req.params;
  const { name } = req.body;

  const organizer = (req as CustomRequest).user?.organizer;
  const check = await Categories.findOne({
    name,
    organizer,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("kategori nama duplikat");

  const result = await Categories.findOneAndUpdate(
    { _id: id, organizer },
    { name, organizer },
    { new: true, runValidators: true },
  );

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  return result;
};

const deleteCategories = async (req: Request) => {
  const { id } = req.params;

  const result = await Categories.findOne({
    _id: id,
    organizer: (req as CustomRequest).user?.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id :  ${id}`);

  await result.deleteOne();

  return result;
};

const checkingCategories = async (id: string, organizer?: string) => {
  const filter = { _id: id, ...(organizer ? { organizer } : {}) };
  const result = await Categories.findOne(filter);

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
