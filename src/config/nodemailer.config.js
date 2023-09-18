import nodemailer from "nodemailer";

const config = {
    service: process.env.MAILER_DRIVER,
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT, //port 587
    secureConnection: false, // TLS requires secureConnection to be false
    auth: {
      // type:'custom',
      // method:'custom-m',
      user: process.env.MAILER_USER, // email
      pass: process.env.MAILER_PASS, // password
    },
    // customAuth:{
    //   'custom-m':myCustomMethod
    // }
  }
export const transporter = nodemailer.createTransport(config);
