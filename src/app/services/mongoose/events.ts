import Events from "../../api/v1/events/model";
import { checkingImage } from "./images";
import { checkingCategories } from "./categories";
import { checkingTalents } from "./talents";
import { BadRequestError, NotFoundError } from "../../errors";
import { Request } from "express";
import { CustomRequest } from "../../middlewares/auth";
import { escapeRegex } from "../../utils/escapeRegex";

const createEvents = async (req: Request) => {
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  const organizer = (req as CustomRequest).user?.organizer;
  await checkingImage(image);
  await checkingCategories(category, organizer);
  await checkingTalents(talent, organizer);

  const check = await Events.findOne({
    title,
    organizer,
  });

  if (check) throw new BadRequestError("judul event duplikat");

  const result = await Events.create({
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
    organizer,
  });

  return result;
};

const getAllEvents = async (req: Request) => {
  const { keyword, category, talent } = req.query;
  const organizer = (req as CustomRequest).user?.organizer;
  let condition: Record<string, unknown> = { organizer };

  if (keyword) {
    condition = {
      ...condition,
      title: { $regex: escapeRegex(String(keyword)), $options: "i" },
    };
  }

  if (category) {
    condition = { ...condition, category };
  }

  if (talent) {
    condition = { ...condition, talent };
  }
  const result = await Events.find(condition)
    .populate({ path: "image", select: "_id name" })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "_id  name" },
    });

  return result;
};

const getOneEvents = async (req: Request) => {
  const { id } = req.params;

  const result = await Events.findOne({
    _id: id,
    organizer: (req as CustomRequest).user?.organizer,
  })
    .populate({ path: "image", select: "_id name" })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "_id  name" },
    });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const updateEvents = async (req: Request) => {
  const { id } = req.params;
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  const organizer = (req as CustomRequest).user?.organizer;
  await checkingImage(image);
  await checkingCategories(category, organizer);
  await checkingTalents(talent, organizer);

  const check = await Events.findOne({
    title,
    organizer,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("judul event duplikat");

  const result = await Events.findOneAndUpdate(
    { _id: id, organizer },
    {
      title,
      date,
      about,
      tagline,
      venueName,
      keyPoint,
      statusEvent,
      tickets,
      image,
      category,
      talent,
      organizer,
    },
    { new: true, runValidators: true },
  );

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const deleteEvents = async (req: Request) => {
  const { id } = req.params;

  const result = await Events.findOne({
    _id: id,
    organizer: (req as CustomRequest).user?.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  await result.deleteOne();

  return result;
};

export { createEvents, getAllEvents, getOneEvents, updateEvents, deleteEvents };
