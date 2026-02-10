import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import {
  getAllPayments,
  createPayments,
  getOnePayments,
  updatePayments,
  deletePayments,
} from '../../../services/mongoose/payments';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createPayments(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllPayments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOnePayments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updatePayments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deletePayments(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export {
  index,
  find,
  update,
  destroy,
  create,
};
