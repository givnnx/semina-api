import {
  getAllTalents,
  getOneTalents,
  updateTalents,
  createTalents,
  deleteTalents,
} from '../../../services/mongoose/talents';

import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createTalents(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllTalents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOneTalents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateTalents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteTalents(req);

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
