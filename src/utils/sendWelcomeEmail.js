import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (toEmail, name) => {
  try {
    const mailOptions = {
      from: `"Nước Hoa Store" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Chào mừng bạn đến với Nước Hoa Store!",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background-color: #f4c2c2; padding: 30px; text-align: center;">
            <h1 style="color: #b33a3a; margin: 0;">Nước Hoa Store</h1>
            <p style="color: #7a2f2f; font-size: 18px; margin: 10px 0 0;">Chào mừng bạn đến với thế giới hương thơm đẳng cấp</p>
          </div>
          <div style="padding: 30px; color: #444444;">
            <h2 style="color: #b33a3a;">Xin chào ${name},</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Nước Hoa Store</strong> – nơi hội tụ những mùi hương tinh tế và độc đáo từ khắp nơi trên thế giới.</p>
            <p>Chúng tôi rất vui khi được đồng hành cùng bạn trên hành trình tìm kiếm và trải nghiệm những sản phẩm nước hoa chính hãng, đa dạng từ các thương hiệu danh tiếng.</p>
            <p>Hãy khám phá ngay các ưu đãi <strong>đặc biệt</strong> dành riêng cho khách hàng thân thiết của chúng tôi!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://nuochoastore.example.com" style="background-color: #b33a3a; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px;">Khám phá ngay</a>
            </div>

            <p>Nếu bạn cần hỗ trợ hoặc tư vấn, đừng ngần ngại liên hệ với chúng tôi qua email này hoặc số hotline <strong>0123 456 789</strong>.</p>

            <p>Trân trọng,</p>
            <p><strong>Đội ngũ Nước Hoa Store</strong></p>
          </div>
          <div style="background: #f4c2c2; text-align: center; padding: 15px; color: #7a2f2f; font-size: 14px;">
            © 2025 Nước Hoa Store. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    throw new Error("Lỗi khi gửi email: " + error.message);
  }
};
