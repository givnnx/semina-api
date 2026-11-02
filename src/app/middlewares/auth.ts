import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { isTokenValid } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: {
    email: string;
    role: string;
    name: string;
    organizer: string;
    id: string;
  };
}

export interface ParticipantRequest extends Request {
  participant?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
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
const authenticateParticipant = async (
  req: ParticipantRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    const payload = isTokenValid({ token }) as JwtPayload;

    req.participant = {
      id: payload.participantId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    next();
  } catch (error) {
    next(error);
  }
};


export { authenticateUser, authorizeRoles, authenticateParticipant };
