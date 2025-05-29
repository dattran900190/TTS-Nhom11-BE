import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USERNAME } from "../configs/enviroments.js";

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Error sending email: " + error.message);
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
	user: EMAIL_USERNAME,
  pass: EMAIL_PASSWORD,
  },
});
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Nước Hoa Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mã OTP lấy lại mật khẩu",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f3f3;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #b33a3a; text-align: center;">🔐 Mã OTP lấy lại mật khẩu</h2>
        <p style="font-size: 16px;">Xin chào,</p>
        <p style="font-size: 16px;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn. Mã OTP của bạn là:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; background: #eee; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #555;">Mã này có hiệu lực trong <strong>10 phút</strong>. Vui lòng không chia sẻ mã với bất kỳ ai.</p>
        <p style="font-size: 14px; color: #999;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
        <p style="margin-top: 30px; font-size: 14px;">Trân trọng,<br><strong>Nước Hoa Store</strong></p>
      </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
