import nodemailer from "nodemailer";

export const sendConfirmationEmail = async (email, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Désactiver la vérification stricte des certificats
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirmation de votre inscription",
    html: `<p>Bonjour ${name},</p><p>Merci pour votre inscription.`,
  };

  await transporter.sendMail(mailOptions);
};
