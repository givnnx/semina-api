import nodemailer from "nodemailer";
import Mustache from "mustache";
import { gmail, password } from "../../config";
import fs from "fs";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: gmail,
    pass: password,
  },
});

const otpMail = async (email: string, data: any) => {
  try {
    let template = fs.readFileSync("src/app/views/email/otp.html", "utf8");

    let message = {
      from: gmail,
      to: email,
      subject: "Otp for registration is: ",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (ex) {
    console.log(ex);
  }
};

export { otpMail };
