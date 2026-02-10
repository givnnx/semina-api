import { signin, signup } from "../../../services/mongoose/auth";

import { StatusCodes } from "http-status-codes";

import { Request, Response, NextFunction } from "express";

const signinCms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await signin(req.body);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const signupCms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await signup(req.body);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export { signinCms, signupCms };
