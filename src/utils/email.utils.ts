import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { env } from "../config/env";
import { logger } from "../config/winston";

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
        logger.error("Server is not ready to take our messages", error);
      } else {
        logger.error("Server is not ready to take our messages", error);
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
