import handlebars from "handlebars";
import fs from "fs";
import { transporter } from "../../config/nodemailer.config";
const path = require("path");

const appRoot = path.resolve(__dirname);

let readHTMLFile = function (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
};

function Mail(
  emailData,
  replacements,
  htmlFileName,
  pdfBufferData = null,
  pdfFileName = null
) {
  return new Promise((resolve, reject) => {
    // create reusable transporter object using the default SMTP transport

    let filePath = appRoot + "/mail-templates/" + htmlFileName;
 
    readHTMLFile(filePath)
      .then(async (html) => {
        var template = handlebars.compile(html);
        var htmlsend = template(replacements);
        const msg = {
          from: emailData.from || process.env.MAILER_USER, // sender address
          to: emailData.to, // list of receivers
          subject: emailData.subject, // Subject line
          html: htmlsend,
        };

        // ADD attachments
        if (pdfBufferData) {
          msg.attachments = {
            filename: pdfFileName,
            content: pdfBufferData,
          };
        }

        // send mail with defined transport object
        const info = await transporter.sendMail(msg);
        resolve(info);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export default Mail;
