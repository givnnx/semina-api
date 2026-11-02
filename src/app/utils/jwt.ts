import jwt from 'jsonwebtoken';
import {
  jwtSecret,
  jwtExpiration,
  jwtRefreshTokenExpiration,
  jwtRefreshTokenSecret,
} from '../config';

const createJWT = ({ payload }: { payload: Record<string, unknown> }) => {
  const token = jwt.sign(payload, jwtSecret as jwt.Secret, {
    expiresIn: jwtExpiration,
    algorithm: "HS256",
  } as jwt.SignOptions);
  return token;
};

const createRefreshJWT = ({ payload }: { payload: Record<string, unknown> }) => {
  const token = jwt.sign(payload, jwtRefreshTokenSecret as jwt.Secret, {
    expiresIn: jwtRefreshTokenExpiration,
    algorithm: "HS256",
  } as jwt.SignOptions);
  return token;
};

const isTokenValid = ({ token }: { token: string }) =>
  jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });

const isTokenValidRefreshToken = ({ token }: { token: string }) =>
  jwt.verify(token, jwtRefreshTokenSecret, { algorithms: ["HS256"] });

export {
  createJWT,
  createRefreshJWT,
  isTokenValid,
  isTokenValidRefreshToken,
};

