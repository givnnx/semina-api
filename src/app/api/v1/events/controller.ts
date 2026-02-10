import {
  getAllEvents,
  getOneEvents,
  updateEvents,
  createEvents,
  deleteEvents,
} from '../../../services/mongoose/events';

import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createEvents(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllEvents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOneEvents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateEvents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteEvents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export { create, index, find, destroy, update };
