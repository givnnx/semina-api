import { getAllOrders } from '../../../services/mongoose/orders';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllOrders(req);

    res.status(StatusCodes.OK).json({
      data: { order: result.data, pages: result.pages, total: result.total },
    });
  } catch (err) {
    next(err);
  }
};

export {
  index,
};
