import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  port: 587,
  host: process.env.NEXT_SMTP_HOST,
  secure: false,
  auth: {
    user: process.env.NEXT_SMTP_USER,
    pass: process.env.NEXT_SMTP_PASSWORD,
  },
  from: `${process.env.FROM_SMTP_USER_EMAIL}`,
});
