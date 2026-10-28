// import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_APP_PASSWORD,
//     },
// });

// export default async function sendMail(to: string, subject: string, html: string) {
//     await transporter.sendMail({
//         from: process.env.SMTP_USER,
//         to,
//         subject,
//         html,
//     });
// }
