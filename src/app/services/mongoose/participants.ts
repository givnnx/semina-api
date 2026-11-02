import crypto from "crypto";
import Events from "../../api/v1/events/model";
import Payments from "../../api/v1/payments/model";
import Orders from "../../api/v1/orders/model";
import Participant from "../../api/v1/participants/model";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../../errors";
import { createJWT, createTokenParticipant } from "../../utils";
import { otpMail } from "../mail";
import { Request } from "express";
import { ParticipantRequest } from "../../middlewares/auth";

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

  const generatedOtp = crypto.randomInt(100000, 1000000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  if (result) {
    result.firstName = firstName;
    result.lastName = lastName;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = generatedOtp;
    result.otpExpiresAt = otpExpiresAt;
    await result.save();
  } else {
    result = await Participant.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: generatedOtp,
      otpExpiresAt,
    });
  }
  await otpMail(email, result);

  const resultObj = result.toObject() as unknown as Record<string, unknown>;
  delete resultObj.password;
  delete resultObj.otp;
  delete resultObj.otpExpiresAt;

  return resultObj;
};

const activateParticipant = async (req: Request) => {
  const { otp, email } = req.body;
  const check = await Participant.findOne({
    email,
  });

  if (!check) throw new NotFoundError("Partisipan belum terdaftar");

  if (check.otpExpiresAt && check.otpExpiresAt < new Date()) {
    throw new BadRequestError("Kode otp telah kadaluarsa");
  }

  if (!check.otp) {
    throw new BadRequestError("Akun sudah diaktivasi atau kode otp tidak valid");
  }

  const providedOtpBuffer = Buffer.from(String(otp || ""));
  const storedOtpBuffer = Buffer.from(String(check.otp));
  if (
    providedOtpBuffer.length !== storedOtpBuffer.length ||
    !crypto.timingSafeEqual(providedOtpBuffer, storedOtpBuffer)
  ) {
    throw new BadRequestError("Kode otp salah");
  }

  const result = await Participant.findByIdAndUpdate(
    check._id,
    {
      status: "aktif",
      $unset: { otp: 1, otpExpiresAt: 1 },
    },
    { new: true },
  );

  if (!result) throw new NotFoundError("Failed to activate");

  const resultObj = result.toObject() as unknown as Record<string, unknown>;
  delete resultObj.password;
  delete resultObj.otp;
  delete resultObj.otpExpiresAt;

  return resultObj;
};

const getAllPaymentByOrganizer = async (req: Request) => {
  const { organizer } = req.params;
  const filter: Record<string, unknown> = { status: true };
  if (organizer) {
    filter.organizer = organizer;
  }
  const result = await Payments.find(filter)
    .populate("image")
    .select("_id type image status organizer");
  return result;
};

const checkoutOrder = async (req: ParticipantRequest) => {
  const { event, personalDetail, payment, tickets } = req.body;

  if (
    !event ||
    !personalDetail ||
    !payment ||
    !tickets ||
    !Array.isArray(tickets) ||
    tickets.length === 0
  ) {
    throw new BadRequestError(
      "Please provide all required fields: event, personalDetail, payment, tickets",
    );
  }

  const { firstName, lastName, email, role } = personalDetail;
  if (!firstName || !email) {
    throw new BadRequestError(
      "Please provide personalDetail (firstName and email required)",
    );
  }

  const checkingEvent = await Events.findOne({ _id: event });
  if (!checkingEvent) {
    throw new NotFoundError(`Tidak ada acara dengan id : ${event}`);
  }

  const checkingPayment = await Payments.findOne({ _id: payment });
  if (!checkingPayment) {
    throw new NotFoundError(`Tidak ada metode pembayaran dengan id : ${payment}`);
  }

  let totalPay = 0;
  let totalOrderTicket = 0;
  const orderItems: Array<{
    ticketCategories: {
      type: string;
      price: number;
    };
    sumTicket: number;
  }> = [];

  for (const item of tickets as Array<{
    ticketCategories?: { type?: string };
    sumTicket?: number;
  }>) {
    const ticketCatType = item.ticketCategories?.type;
    if (!ticketCatType) {
      throw new BadRequestError("Kategori tiket harus diisi");
    }
    const sumTicket = Number(item.sumTicket) || 0;

    if (sumTicket <= 0) {
      throw new BadRequestError("Jumlah tiket harus lebih dari 0");
    }

    const eventTicket = checkingEvent.tickets.find(
      (t) => t.type === ticketCatType,
    );
    if (!eventTicket) {
      throw new NotFoundError(`Tiket kategori ${ticketCatType} tidak ditemukan`);
    }

    if (eventTicket.stock < sumTicket) {
      throw new BadRequestError(
        `Stok tiket untuk kategori ${ticketCatType} tidak mencukupi`,
      );
    }

    eventTicket.stock -= sumTicket;

    const price = eventTicket.price;
    totalPay += price * sumTicket;
    totalOrderTicket += sumTicket;

    orderItems.push({
      ticketCategories: {
        type: ticketCatType,
        price,
      },
      sumTicket,
    });
  }

  await checkingEvent.save();

  const historyEvent = {
    title: checkingEvent.title,
    date: checkingEvent.date,
    about: checkingEvent.about,
    tagline: checkingEvent.tagline,
    keyPoint: checkingEvent.keyPoint,
    venueName: checkingEvent.venueName,
    image: checkingEvent.image,
    category: checkingEvent.category,
    talent: checkingEvent.talent,
    organizer: checkingEvent.organizer,
  };

  const participantId = req.participant?.id;

  const order = await Orders.create({
    date: new Date(),
    personalDetail: {
      firstName,
      lastName: lastName || "",
      email,
      role: role || "-",
    },
    status: "pending",
    totalPay,
    totalOrderTicket,
    orderItems,
    participant: participantId,
    payment,
    event,
    historyEvent,
  });

  return order;
};

const getDashboardOrder = async (req: ParticipantRequest) => {
  const participantId = req.participant?.id;
  const result = await Orders.find({ participant: participantId })
    .populate("payment")
    .populate("event");
  return result;
};

export {
  getAllEvents,
  getOneEvent,
  signinParticipant,
  signupParticipant,
  activateParticipant,
  getAllPaymentByOrganizer,
  checkoutOrder,
  getDashboardOrder,
};
