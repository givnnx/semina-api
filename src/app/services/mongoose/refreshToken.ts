import UserRefreshToken from '../../api/v1/userRefreshToken/model';
import {
  isTokenValidRefreshToken,
  createJWT,
  createTokenUser,
} from '../../utils';
import Users from '../../api/v1/users/model';
import { NotFoundError } from '../../errors';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

const createUserRefreshToken = async (payload: any) => {
  const result = await UserRefreshToken.create(payload);

  return result;
};

const getUserRefreshToken = async (req: Request) => {
  const { refreshToken } = req.params;
  const result = await UserRefreshToken.findOne({
    refreshToken,
  });

  if (!result) throw new NotFoundError(`refreshToken tidak valid `);

  const payload = isTokenValidRefreshToken({ token: result.refreshToken as string }) as JwtPayload;

  if (!payload.email) throw new NotFoundError('Invalid Token Payload');

  const userCheck = await Users.findOne({ email: payload.email });

  const token = createJWT({ payload: createTokenUser(userCheck) });

  return token;
};

export { createUserRefreshToken, getUserRefreshToken };

