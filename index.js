const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Đọc thông tin từ file .env

const app = express();
app.use(express.json()); // Xử lý JSON trong request

// Định nghĩa API gửi email
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ 'to', 'subject' và 'text'" });
  }

  try {
    // Cấu hình email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL, // Email gửi
        pass: process.env.EMAIL_PASSWORD, // Mật khẩu hoặc app password
      },
    });

    // Tạo thông tin email
    const mailOptions = {
      from: process.env.EMAIL, // Email người gửi
      to, // Email người nhận
      subject, // Chủ đề
      text, // Nội dung
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email đã được gửi", info });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ error: "Không thể gửi email. Vui lòng thử lại sau." });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
