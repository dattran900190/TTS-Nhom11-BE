import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_USERNAME } from "../configs/enviroments.js";

export const sendConfirmEmail = async (toEmail, name, token) => {
  const confirmUrl = `${process.env.BASE_URL}/api/auth/confirm-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Nước Hoa Store" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🌟 Xác nhận email đăng ký tài khoản của bạn",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f3f3;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">Xin chào, ${name}!</h2>
          <p style="font-size: 16px; color: #555;">
            Cảm ơn bạn đã đăng ký tài khoản tại <strong>Nước Hoa Store</strong>.
          </p>
          <p style="font-size: 16px; color: #555;">
            Vui lòng nhấn nút bên dưới để xác nhận email của bạn:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}"
               style="background-color: #007bff; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
              Xác nhận Email
            </a>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">
            Liên kết xác nhận sẽ hết hạn trong 24 giờ.<br>
            Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email.
          </p>
          <p style="margin-top: 30px; font-size: 14px; color: #777; text-align: center;">
            Trân trọng,<br>
            <strong>Nước Hoa Store</strong>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
