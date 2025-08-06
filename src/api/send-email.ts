import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = request.body;

  // Basic validation
  if (!name || !email || !message) {
    return response.status(400).json({ message: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service
    secure: true, // true for 465, false for other ports
    auth: {
      type: "OAuth2",
      user: "me@gmail.com",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    // We use our own email address as the sender.
    // The user's email is set as the `replyTo` address.
    // This is a security measure to prevent spam filters from blocking the email.
    from: `Contact Form <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Change to your receiving email address
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return response.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Error sending email' });
  }
}
