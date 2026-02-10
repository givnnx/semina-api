import {
  getAllEvents,
  getOneEvent,
  signinParticipant,
  signupParticipant,
  activateParticipant,
} from '../../../services/mongoose/participants';

import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

const getAllLandingPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllEvents(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getDetailLandingPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getOneEvent(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await signupParticipant(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const activeParticipant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await activateParticipant(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await signinParticipant(req);

    res.status(StatusCodes.OK).json({
      data: { token: result },
    });
  } catch (err) {
    next(err);
  }
};

export {
  getAllLandingPage,
  getDetailLandingPage,
  signin,
  signup,
  activeParticipant,
};
