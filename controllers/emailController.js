import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // or 587
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL, // admin gets the mail
      subject: `New Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return res.json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "❌ Failed to send email." });
  }
};
