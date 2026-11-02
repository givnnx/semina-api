import nodemailer from "nodemailer";
import Mustache from "mustache";
import { gmail, password } from "../../config";
import fs from "fs";
import path from "path";

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
    const templatePath = path.resolve(__dirname, "../../views/email/otp.html");
    const template = fs.readFileSync(templatePath, "utf8");

    let message = {
      from: gmail,
      to: email,
      subject: "Otp for registration is: ",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (ex) {
    console.error("Mail delivery error:", ex);
    if (process.env.NODE_ENV === "production") {
      throw ex;
    }
  }
};

export { otpMail };
