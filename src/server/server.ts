/**
 * This is a simple Dev backend server using Hono to handle email sending via a contact form.
 * it uses nodemailer to send emails through Gmail's SMTP server.
 * For production the code sits in api/send-email.ts and users Vercel's serverless functions.
 */

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import nodemailer from 'nodemailer';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/api/*', cors());


app.post('/api/send-email', async (c) => {
  const { name, email, message } = await c.req.json();

  if (!name || !email || !message) {
    return c.json({ message: 'Missing required fields' }, 400);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });


  const from = `Contact Form <${process.env.EMAIL_USER}>`;
  const to = process.env.EMAIL_USER; // Change to your receiving email address
  const replyTo = email;
  const subject = `New Contact Form Submission from ${name}`;

  const mailOptions = {
    from,
    to,
    replyTo,
    subject,
    html: emailTemplate(name, from, subject, message),
  };

  try {
    await transporter.sendMail(mailOptions);
    return c.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error(error);
    return c.json({ message: error.message, stack: error.stack }, 500);
  }
});

serve({
  fetch: app.fetch,
  port: 3001,
});


const emailTemplate = (name: string, email: string, subject: string, message: string) => `
<html lang="en" style="margin: 0; padding: 0; box-sizing: border-box;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; line-height: 1.5; color: #ffffff; background: #0a0a0a; padding: min(20px, 3vw);">
    <div class="email-container" style="padding: 0; box-sizing: border-box; max-width: 600px; margin: 10% auto; background: #1a1a1a; border: 2px solid #333;">
        <div class="header" style="margin: 0; box-sizing: border-box; background: #FF6B35; padding: clamp(24px, 6vw, 40px); text-align: center;">
            <div class="avatar" style="padding: 0; box-sizing: border-box; width: 60px; height: 60px; background: #1a1a1a; border-radius: 50%; border: 3px solid #1a1a1a; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #FF6B35;">IA</div>
            <h1 style="margin: 0; padding: 0; box-sizing: border-box; font-size: clamp(20px, 5vw, 28px); font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">${subject}</h1>
        </div>
        
        <div class="content" style="margin: 0; box-sizing: border-box; padding: clamp(24px, 5vw, 40px);">
            <div class="notification-badge" style="margin: 0; box-sizing: border-box; background: rgba(255, 107, 53, 0.1); color: #FF6B35; padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; margin-bottom: 32px; border: 1px solid rgba(255, 107, 53, 0.2); position: relative;">
                LIVE SUBMISSION RECEIVED
            </div>
            
            <div class="fields-container" style="margin: 0; padding: 0; box-sizing: border-box; display: grid; gap: 2px; background: #333;">
                <div class="contact-section" style="margin: 0; box-sizing: border-box; background: #2a2a2a; padding: clamp(24px, 5vw, 32px);">
                    <div class="contact-header" style="margin: 0; padding: 0; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div class="contact-label" style="margin: 0; padding: 0; box-sizing: border-box; font-size: clamp(10px, 2vw, 12px); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #FF6B35; opacity: 0.7;">FROM</div>
                        <div class="contact-actions" style="margin: 0; padding: 0; box-sizing: border-box;">
                            <a href="mailto:${email}" class="reply-btn" style="margin: 0; box-sizing: border-box; background: #FF6B35; color: #1a1a1a; text-decoration: none; font-size: clamp(10px, 2vw, 11px); font-weight: 700; padding: 6px 12px; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.2s ease;">REPLY</a>
                        </div>
                    </div>
                    <div class="contact-name" style="margin: 0; padding: 0; box-sizing: border-box; font-size: clamp(24px, 5vw, 32px); font-weight: 700; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.5px;">${name}</div>
                    <div class="contact-email" style="margin: 0; padding: 0; box-sizing: border-box; font-size: clamp(14px, 3vw, 16px); opacity: 0.8;">
                        <a href="mailto:${email}" class="email-link" style="margin: 0; padding: 0; box-sizing: border-box; color: #a0a0a0; text-decoration: none; transition: color 0.2s ease;">${email}</a>
                    </div>
                </div>
                <div class="field-row" style="margin: 0; box-sizing: border-box; background: #2a2a2a; padding: clamp(16px, 4vw, 24px); display: grid; grid-template-columns: minmax(80px, max-content) 1fr; gap: clamp(12px, 3vw, 20px); align-items: center;">
                    <div class="field-label" style="margin: 0; padding: 0; box-sizing: border-box; font-size: clamp(12px, 2.5vw, 14px); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #FF6B35;">message</div>
                    <div class="field-value" style="margin: 0; padding: 0; box-sizing: border-box; font-size: clamp(14px, 3vw, 16px); color: #ffffff; font-weight: 500; word-wrap: break-word;">${message}</div>
                </div>
            </div>
            
            <div class="tech-stack" style="margin: 0; padding: 0; box-sizing: border-box; margin-top: 32px; padding-top: 24px; border-top: 2px solid #333; display: flex; flex-wrap: wrap; gap: 8px;">
                <div class="tech-tag" style="margin: 0; box-sizing: border-box; background: rgba(255, 107, 53, 0.1); color: #FF6B35; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; border: 1px solid rgba(255, 107, 53, 0.2);">CONTACT FORM</div>
                <div class="tech-tag" style="margin: 0; box-sizing: border-box; background: rgba(255, 107, 53, 0.1); color: #FF6B35; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; border: 1px solid rgba(255, 107, 53, 0.2);">AUTOMATED</div>
                <div class="tech-tag" style="margin: 0; box-sizing: border-box; background: rgba(255, 107, 53, 0.1); color: #FF6B35; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; border: 1px solid rgba(255, 107, 53, 0.2);">PORTFOLIO</div>
            </div>
        </div>
        
        <div class="footer" style="margin: 0; box-sizing: border-box; background: #0f0f0f; padding: clamp(20px, 4vw, 32px); text-align: center; border-top: 2px solid #333;">
            <p style="margin: 0; padding: 0; box-sizing: border-box; color: #666; font-size: clamp(12px, 2.5vw, 14px); margin-bottom: 16px;">This email was automatically generated from your portfolio contact form.</p>
        </div>
    </div>
</body>
</html>`.trim();