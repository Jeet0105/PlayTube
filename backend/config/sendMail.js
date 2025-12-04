import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"PlayTube Support" <${process.env.USER}>`,
      to,
      replyTo: process.env.USER,
      subject: "Your PlayTube Password Reset OTP",
      html: `
        <div style="
            font-family: Arial, sans-serif; 
            background: #f4f4f4; 
            padding: 20px;
        ">
            <div style="
                max-width: 480px; 
                margin: auto; 
                background: #ffffff; 
                padding: 24px; 
                border-radius: 10px; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            ">
                <h2 style="
                    color: #222; 
                    margin-bottom: 16px; 
                    text-align: center;
                ">
                    Password Reset Request
                </h2>

                <p style="font-size: 15px; color: #444; line-height: 1.6;">
                    We received a request to reset your PlayTube password.
                    Use the OTP below to verify it’s really you:
                </p>

                <div style="
                    margin: 24px 0; 
                    text-align: center;
                ">
                    <span style="
                        display: inline-block;
                        font-size: 28px; 
                        font-weight: bold; 
                        letter-spacing: 4px; 
                        color: #ff6a00;
                        padding: 12px 20px; 
                        background: #fff4e6;
                        border-radius: 8px;
                    ">
                        ${otp}
                    </span>
                </div>

                <p style="font-size: 14px; color: #555; line-height: 1.6;">
                    This OTP is valid for <b>5 minutes</b>.  
                    If you didn’t make this request, no worries — just ignore this email.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

                <p style="font-size: 12px; color: #888; text-align: center;">
                    © ${new Date().getFullYear()} PlayTube — All Rights Reserved.
                </p>
            </div>
        </div>
      `,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export default sendMail;
