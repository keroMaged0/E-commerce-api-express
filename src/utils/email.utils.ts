import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "../config/env";

export interface Imail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

 

class MailTransporter {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor() {
    this.transporter = createTransport({
      service: env.sendEmail.service,
      host: env.sendEmail.host,
      port: env.sendEmail.port,
      auth: env.sendEmail.auth,
      secure: env.sendEmail.secure,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  verifyTransporter() {
    this.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages", success);
      }
    });
  }

  async sendMail(options: Imail) {
    await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}

export const mailTransporter = new MailTransporter();
