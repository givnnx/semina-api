import Users from '../../api/v1/users/model';
import Organizers from '../../api/v1/organizers/model';
import { BadRequestError } from '../../errors';
import { Request } from 'express';
import { CustomRequest } from '../../middlewares/auth';

const createOrganizer = async (req: Request) => {
  const { organizer, role, email, password, confirmPassword, name } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError('Password dan Konfirmasi password tidak cocok');
  }

  const result = await Organizers.create({ organizer });

  const users = await Users.create({
    email,
    name,
    password,
    organizer: result._id,
    role,
  });

  const usersObj = users.toObject() as unknown as Record<string, unknown>;
  delete usersObj.password;

  return usersObj;
};

const createUsers = async (req: Request) => {
  const { name, password, role, confirmPassword, email } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError('Password dan Konfirmasi password tidak cocok');
  }

  const customReq = req as CustomRequest;
  const result = await Users.create({
    name,
    email,
    organizer: customReq.user?.organizer,
    password,
    role,
  });

  const resultObj = result.toObject() as unknown as Record<string, unknown>;
  delete resultObj.password;

  return resultObj;
};

const getAllUsers = async (req: Request) => {
  const user = (req as CustomRequest).user;
  const filter = user?.role === 'owner' ? {} : { organizer: user?.organizer };
  const result = await Users.find(filter).select('-password');

  return result;
};

export { createOrganizer, createUsers, getAllUsers };

