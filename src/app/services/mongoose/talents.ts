import Talents from "../../api/v1/talents/model";
import { checkingImage } from "./images";
import { Request } from "express";

import { NotFoundError, BadRequestError } from "../../errors";

const getAllTalents = async (req: Request) => {
  const { keyword } = req.query;

  let condition: any = { organizer: (req as any).user.organizer };

  if (keyword) {
    condition = { ...condition, name: { $regex: keyword, $options: "i" } };
  }

  const result = await Talents.find(condition)
    .populate({
      path: "image",
      select: "_id name",
    })
    .select("_id name role image");

  return result;
};

const createTalents = async (req: Request) => {
  const { name, role, image } = req.body;

  await checkingImage(image);

  const check = await Talents.findOne({
    name,
    organizer: (req as any).user.organizer,
  });

  if (check) throw new BadRequestError("pembicara nama duplikat");

  const result = await Talents.create({
    name,
    image,
    role,
    organizer: (req as any).user.organizer,
  });

  return result;
};

const getOneTalents = async (req: Request) => {
  const { id } = req.params;

  const result = await Talents.findOne({
    _id: id,
    organizer: (req as any).user.organizer,
  })
    .populate({
      path: "image",
      select: "_id name",
    })
    .select("_id name role image");

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

const updateTalents = async (req: Request) => {
  const { id } = req.params;
  const { name, image, role } = req.body;

  await checkingImage(image);

  const check = await Talents.findOne({
    name,
    organizer: (req as any).user.organizer,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("pembicara nama duplikat");

  const result = await Talents.findOneAndUpdate(
    { _id: id },
    { name, image, role, organizer: (req as any).user.organizer },
    { new: true, runValidators: true },
  );

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

const deleteTalents = async (req: Request) => {
  const { id } = req.params;

  const result = await Talents.findOne({
    _id: id,
    organizer: (req as any).user.organizer,
  });

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  await result.deleteOne();

  return result;
};

const checkingTalents = async (id: string) => {
  const result = await Talents.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

export {
  getAllTalents,
  createTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
  checkingTalents,
};
