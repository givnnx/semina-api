// import services images
import { createImages } from '../../../services/mongoose/images';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createImages(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export { create };
