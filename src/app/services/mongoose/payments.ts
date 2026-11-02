import Payments from '../../api/v1/payments/model';
import { checkingImage } from './images';
import { Request } from 'express';
import { CustomRequest } from '../../middlewares/auth';

import { NotFoundError, BadRequestError } from '../../errors';

const getAllPayments = async (req: Request) => {
  const organizer = (req as CustomRequest).user?.organizer;
  const condition = { organizer };

  const result = await Payments.find(condition)
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id type status image');

  return result;
};

const createPayments = async (req: Request) => {
  const { type, image } = req.body;

  await checkingImage(image);

  const organizer = (req as CustomRequest).user?.organizer;
  const check = await Payments.findOne({ type, organizer });

  if (check) throw new BadRequestError('Tipe pembayaran duplikat');

  const result = await Payments.create({
    image,
    type,
    organizer,
  });

  return result;
};

const getOnePayments = async (req: Request) => {
  const { id } = req.params;

  const result = await Payments.findOne({
    _id: id,
    organizer: (req as CustomRequest).user?.organizer,
  })
    .populate({
      path: 'image',
      select: '_id name',
    })
    .select('_id type status image');

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  return result;
};

const updatePayments = async (req: Request) => {
  const { id } = req.params;
  const { type, image } = req.body;

  await checkingImage(image);

  const organizer = (req as CustomRequest).user?.organizer;
  const check = await Payments.findOne({
    type,
    organizer,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError('Tipe pembayaran duplikat');

  const result = await Payments.findOneAndUpdate(
    { _id: id, organizer },
    { type, image, organizer },
    { new: true, runValidators: true }
  );

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  return result;
};

const deletePayments = async (req: Request) => {
  const { id } = req.params;

  const result = await Payments.findOne({
    _id: id,
    organizer: (req as CustomRequest).user?.organizer,
  });

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  await result.deleteOne();

  return result;
};

const checkingPayments = async (id: string) => {
  const result = await Payments.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada tipe pembayaran dengan id :  ${id}`);

  return result;
};

export {
  getAllPayments,
  createPayments,
  getOnePayments,
  updatePayments,
  deletePayments,
  checkingPayments,
};
