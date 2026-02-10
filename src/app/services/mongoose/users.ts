import Users from '../../api/v1/users/model';
import Organizers from '../../api/v1/organizers/model';
import { BadRequestError } from '../../errors';
import { Request } from 'express';

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

  const usersObj = users.toObject();
  delete usersObj.password;

  return usersObj;
};

const createUsers = async (req: Request) => {
  const { name, password, role, confirmPassword, email } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError('Password dan Konfirmasi password tidak cocok');
  }

  const result = await Users.create({
    name,
    email,
    organizer: (req as any).user.organizer,
    password,
    role,
  });

  return result;
};

const getAllUsers = async (req: Request) => {
  const result = await Users.find();

  return result;
};

export { createOrganizer, createUsers, getAllUsers };

