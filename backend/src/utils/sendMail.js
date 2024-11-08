import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID, // Replace with your email
    pass: process.env.EMAIL_APP_PASSWORD, // Replace with your email password or app password
  },
});

const sendConfirmationMail = async (to, id) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: [to],
    subject: "Email Verification for MERN Chat App",
    html: `<h1>Click <a href=http://localhost:8000/api/auth/confirmEmail/${id}>here</a> to confirm your email</h1>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification Email sent succesfully");
    return true;
  } catch (error) {
    console.log("Error while sending verification email", error);
    return false;
  }
};

export { sendConfirmationMail };
