import Orders from '../../api/v1/orders/model';
import { Request } from 'express';

const getAllOrders = async (req: Request) => {
  const { limit = 10, page = 1, startDate, endDate } = req.query;
  let condition: any = {};

  if ((req as any).user.role !== 'owner') {
    condition = { ...condition, 'historyEvent.organizer': (req as any).user.organizer };
  }

  if (startDate && endDate) {
    const start = new Date(startDate as string);
    start.setHours(0, 0, 0);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59);
    condition = {
      ...condition,
      date: {
        $gte: start,
        $lt: end,
      },
    };
  }

  const result = await Orders.find(condition)
    .limit(Number(limit))
    .skip(Number(limit) * (Number(page) - 1));

  const count = await Orders.countDocuments(condition);

  return { data: result, pages: Math.ceil(count / Number(limit)), total: count };
};

export {
  getAllOrders,
};
