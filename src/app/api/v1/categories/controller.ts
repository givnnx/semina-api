import {
  getAllCategories,
  getOneCategories,
  createCategories,
  updateCategories,
  deleteCategories,
} from '../../../services/mongoose/categories';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createCategories(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllCategories(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const find = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOneCategories(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await updateCategories(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteCategories(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export {
  create,
  index,
  find,
  update,
  destroy,
};
