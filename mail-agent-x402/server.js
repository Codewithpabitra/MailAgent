require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const Groq = require("groq-sdk");

const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const paidRequests = new Set();

// x402-style payment check middleware
app.use("/send-email", (req, res, next) => {
  const paymentToken = req.headers["x-payment-token"];
  if (!paymentToken || !paidRequests.has(paymentToken)) {
    return res.status(402).json({
      error: "Payment Required",
      amount: "0.0001 ETH",
      message: "Call /pay first to get a payment token",
    });
  }
  paidRequests.delete(paymentToken);
  next();
});

// Payment endpoint
app.post("/pay", (req, res) => {
  const token = `paid_${Date.now()}_${Math.random()}`;
  paidRequests.add(token);
  console.log(`💰 Payment received for: ${req.body.email}`);
  res.json({ token });
});

// Email generation + sending endpoint
app.post("/send-email", async (req, res) => {
  const { name, email, company, role } = req.body;

  // Generate email using LLaMA via Groq
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Write a short friendly professional email body (under 100 words, no subject line)
                  to ${name}, who is a ${role} at ${company}.
                  Topic: introducing an AI-powered email tool called MailMind.
                  Just write the email body, nothing else.`,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 1,
    max_completion_tokens: 300,
    top_p: 1,
    stream: false,
  });

  const emailBody = chatCompletion.choices[0]?.message?.content || "";

  // Send the email via Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: `Hi ${name}, quick note from MailMind`,
    text: emailBody,
  });

  console.log(`✅ Email sent to ${name} <${email}>`);
  res.json({ success: true, recipient: email, body: emailBody });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));

