import { StatusCodes } from 'http-status-codes';
import {
  getUserRefreshToken,
} from '../../../services/mongoose/refreshToken';
import { Request, Response, NextFunction } from 'express';

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getUserRefreshToken(req);

    res.status(StatusCodes.OK).json({
      data: { token: result },
    });
  } catch (err) {
    console.log('err');
    console.log(err);
    next(err);
  }
};

export { index };
