// import nodemailer from "nodemailer";

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `"Fcom Support" <${process.env.EMAIL_USER}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEmail;

// import fetch from "node-fetch";

// const sendEmail = async (options) => {
//   const response = await fetch("https://api.brevo.com/v3/smtp/email", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "api-key": process.env.SMTP_API,
//     },
//     body: JSON.stringify({
//       sender: {
//         name: "Fcom Support",
//         email: "fsstecom@gmail.com",
//       },
//       to: [
//         {
//           email: options.email,
//         },
//       ],
//       subject: options.subject,
//       htmlContent: options.message,
//     }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Email failed");
//   }
// };

// export default sendEmail;

import { Resend } from "resend";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

const sendEmail = async (options) => {
  const response = await resend.emails.send({
    from: "onboarding@resend.dev", // free default sender
    to: options.email,
    subject: options.subject,
    html: options.message,
  });
  console.log("RESEND FULL RESPONSE 👉", response);

  if (response.error) {
    throw new Error(response.error.message);
  }
};

export default sendEmail;
