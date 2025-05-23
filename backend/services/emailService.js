import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or any SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, template, context }) => {
  const html = `
    <h2>${subject}</h2>
    <p>Hello ${context.name},</p>
    <p>${template === 'welcome-premium' ? `Thanks for subscribing to our ${context.plan} plan! Your next renewal date is ${context.renewalDate}.` : ''}</p>
    <p>${template === 'payment-failed' ? `Your payment of ${context.amount} ${context.currency.toUpperCase()} failed. Please <a href="${context.retryUrl}">retry here</a>.` : ''}</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Email failed:', err.message);
  }
};
