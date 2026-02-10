import jwt from 'jsonwebtoken';
import {
  jwtSecret,
  jwtExpiration,
  jwtRefreshTokenExpiration,
  jwtRefreshTokenSecret,
} from '../config';

const createJWT = ({ payload }: { payload: any }) => {
  const token = jwt.sign(payload, jwtSecret as jwt.Secret, {
    expiresIn: jwtExpiration,
  } as jwt.SignOptions);
  return token;
};

const createRefreshJWT = ({ payload }: { payload: any }) => {
  const token = jwt.sign(payload, jwtRefreshTokenSecret as jwt.Secret, {
    expiresIn: jwtRefreshTokenExpiration,
  } as jwt.SignOptions);
  return token;
};

const isTokenValid = ({ token }: { token: string }) => jwt.verify(token, jwtSecret);

const isTokenValidRefreshToken = ({ token }: { token: string }) =>
  jwt.verify(token, jwtRefreshTokenSecret);

export {
  createJWT,
  createRefreshJWT,
  isTokenValid,
  isTokenValidRefreshToken,
};

