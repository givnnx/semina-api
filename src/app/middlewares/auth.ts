import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { isTokenValid } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: {
    email: string;
    role: string;
    name: string;
    organizer: string;
    id: string;
  };
}

const authenticateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    console.log("token");
    console.log(token);

    if (!token) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    const payload = isTokenValid({ token }) as JwtPayload;

    req.user = {
      email: payload.email,
      role: payload.role,
      name: payload.name,
      organizer: payload.organizer,
      id: payload.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export { authenticateUser, authorizeRoles };
