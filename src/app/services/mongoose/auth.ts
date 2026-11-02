import Users from "../../api/v1/users/model";
import { BadRequestError, UnauthorizedError } from "../../errors";
import { createJWT, createRefreshJWT, createTokenUser } from "../../utils";
import { createUserRefreshToken } from "./refreshToken";

const signin = async (req: any) => {
  const { email, password } = req;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const result = await Users.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = createJWT({ payload: createTokenUser(result) });

  const refreshToken = createRefreshJWT({ payload: createTokenUser(result) });
  await createUserRefreshToken({
    refreshToken,
    user: result._id,
  });

  return { token, role: result.role, email: result.email, refreshToken };
};

const signup = async (req: any) => {
  const { email, password, name, role, organizer } = req;

  if (!email || !password || !name || !role || !organizer) {
    throw new BadRequestError("Please provide all the required fields");
  }

  const checkEmail = await Users.findOne({ email: email });

  if (checkEmail) {
    throw new BadRequestError("Email already exists");
  }

  const user = await Users.create({
    email,
    password,
    name,
    role,
    organizer,
  });

  const userObj = user.toObject() as unknown as Record<string, unknown>;
  delete userObj.password;
  return userObj;
};

export { signin, signup };
