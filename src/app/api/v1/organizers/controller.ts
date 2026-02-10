import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import {
  createOrganizer,
  createUsers,
  getAllUsers,
} from '../../../services/mongoose/users';

const createCMSOrganizer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createOrganizer(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getCMSUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllUsers(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createCMSUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createUsers(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
export {
  createCMSOrganizer,
  getCMSUsers,
  createCMSUser,
};
