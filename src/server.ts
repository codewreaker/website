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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.5;
            color: #ffffff;
            background: #0a0a0a;
            padding: min(20px, 3vw);
        }
        
        .email-container {
            max-width: 600px;
            margin: 10% auto;
            background: #1a1a1a;
            border: 2px solid #333;
        }
        
        .header {
            background: #FF6B35;
            padding: clamp(24px, 6vw, 40px);
            text-align: center;
        }
        
        .avatar {
            width: 60px;
            height: 60px;
            background: #1a1a1a;
            border-radius: 50%;
            border: 3px solid #1a1a1a;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            color: #FF6B35;
        }
        
        .header h1 {
            font-size: clamp(20px, 5vw, 28px);
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
        }
        
        .header .subtitle {
            color: #1a1a1a;
            font-size: clamp(14px, 3vw, 16px);
            font-weight: 500;
            opacity: 0.8;
        }
        
        .content {
            padding: clamp(24px, 5vw, 40px);
        }
        
        .notification-badge {
            background: rgba(255, 107, 53, 0.1);
            color: #FF6B35;
            padding: 12px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 32px;
            border: 1px solid rgba(255, 107, 53, 0.2);
            position: relative;
        }
        
        .notification-badge::before {
            content: '●';
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .fields-container {
            display: grid;
            gap: 2px;
            background: #333;
        }
        
        .field-row {
            background: #2a2a2a;
            padding: clamp(16px, 4vw, 24px);
            display: grid;
            grid-template-columns: minmax(80px, max-content) 1fr;
            gap: clamp(12px, 3vw, 20px);
            align-items: center;
        }
        
        .field-row:hover {
            background: #333;
        }
        
        .field-label {
            font-size: clamp(12px, 2.5vw, 14px);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #FF6B35;
        }
        
        .field-value {
            font-size: clamp(14px, 3vw, 16px);
            color: #ffffff;
            font-weight: 500;
            word-wrap: break-word;
        }
        
        .tech-stack {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 2px solid #333;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .tech-tag {
            background: rgba(255, 107, 53, 0.1);
            color: #FF6B35;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid rgba(255, 107, 53, 0.2);
        }
        
        .footer {
            background: #0f0f0f;
            padding: clamp(20px, 4vw, 32px);
            text-align: center;
            border-top: 2px solid #333;
        }
        
        .footer p {
            color: #666;
            font-size: clamp(12px, 2.5vw, 14px);
            margin-bottom: 16px;
        }

        
        .contact-section {
            background: #2a2a2a;
            padding: clamp(24px, 5vw, 32px);
        }
        
        .contact-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .contact-label {
            font-size: clamp(10px, 2vw, 12px);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #FF6B35;
            opacity: 0.7;
        }
        
        .reply-btn {
            background: #FF6B35;
            color: #1a1a1a;
            text-decoration: none;
            font-size: clamp(10px, 2vw, 11px);
            font-weight: 700;
            padding: 6px 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.2s ease;
        }
        
        .reply-btn:hover {
            background: #ffffff;
            transform: translateY(-1px);
        }
        
        .contact-name {
            font-size: clamp(24px, 5vw, 32px);
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        
        .contact-email {
            font-size: clamp(14px, 3vw, 16px);
            opacity: 0.8;
        }
        
        .contact-section:hover {
            background: #333;
        }
        
        .email-link {
            color: #a0a0a0;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        
        .email-link:hover {
            color: #FF6B35;
        }
        
        .timestamp {
            color: #FF6B35;
            font-size: clamp(12px, 2.5vw, 14px);
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            background: #333;
            padding: 12px 16px;
            border-radius: 8px;
            display: inline-block;
            margin-top: 16px;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="avatar">IA</div>
            <h1>${subject}</h1>
        </div>
        
        <div class="content">
            <div class="notification-badge">
                LIVE SUBMISSION RECEIVED
            </div>
            
            <div class="fields-container">
                <div class="contact-section">
                    <div class="contact-header">
                        <div class="contact-label">FROM</div>
                        <div class="contact-actions">
                            <a href="mailto:${email}" class="reply-btn">REPLY</a>
                        </div>
                    </div>
                    <div class="contact-name">${name}</div>
                    <div class="contact-email">
                        <a href="mailto:${email}" class="email-link">${email}</a>
                    </div>
                </div>
                <div class="field-row">
                    <div class="field-label">message</div>
                    <div class="field-value">${message}</div>
                </div>
            </div>
            
            <div class="tech-stack">
                <div class="tech-tag">CONTACT FORM</div>
                <div class="tech-tag">AUTOMATED</div>
                <div class="tech-tag">PORTFOLIO</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was automatically generated from your portfolio contact form.</p>
        </div>
    </div>
</body>
</html>`.trim();