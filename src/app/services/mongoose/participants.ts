import Events from "../../api/v1/events/model";
import { NotFoundError } from "../../errors";
import Participant, { IParticipant } from "../../api/v1/participants/model";
import { BadRequestError, UnauthorizedError } from "../../errors";
import { createJWT, createTokenParticipant } from "../../utils";
import { otpMail } from "../mail";
import { Request } from "express";

const getAllEvents = async (req: Request) => {
  const result = await Events.find({ statusEvent: "Published" })
    .populate("category")
    .populate("image")
    .select("_id title date tickets venueName");

  return result;
};

const getOneEvent = async (req: Request) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id })
    .populate("category")
    .populate({ path: "talent", populate: "image" })
    .populate("image");

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const signinParticipant = async (req: Request) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const result = await Participant.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  if (result.status === "tidak aktif") {
    throw new UnauthorizedError("Akun anda belum aktif");
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = createJWT({ payload: createTokenParticipant(result) });

  return token;
};

const signupParticipant = async (req: Request) => {
  const { firstName, lastName, email, password, role } = req.body;
  let result = await Participant.findOne({
    email,
    status: "tidak aktif",
  });

  if (result) {
    result.firstName = firstName;
    result.lastName = lastName;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = Math.floor(Math.random() * 9999).toString();
    await result.save();
  } else {
    result = await Participant.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999).toString(),
    });
  }
  await otpMail(email, result);

  const resultObj = result.toObject();
  delete resultObj.password;
  delete resultObj.otp;

  return resultObj;
};

const activateParticipant = async (req: Request) => {
  const { otp, email } = req.body;
  const check = await Participant.findOne({
    email,
  });

  if (!check) throw new NotFoundError("Partisipan belum terdaftar");

  if (check && check.otp !== otp) throw new BadRequestError("Kode otp salah");

  const result = await Participant.findByIdAndUpdate(
    check._id,
    {
      status: "aktif",
    },
    { new: true },
  );

  if (!result) throw new NotFoundError("Failed to activate");

  const resultObj = result.toObject();
  delete resultObj.password;
  delete resultObj.otp;

  return resultObj;
};

export {
  getAllEvents,
  getOneEvent,
  signinParticipant,
  signupParticipant,
  activateParticipant,
};
