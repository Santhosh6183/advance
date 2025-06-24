const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Santhu2004', // your MySQL password
  database: 'onregistration'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// ✅ POST /register route
app.post('/register', async (req, res) => {
  const { name, email, phone, course } = req.body;

  // Basic validation
  if (!name || !email || !phone || !course) {
    return res.status(400).json({ status: "error", message: "All fields are required." });
  }

  const insertSql = "INSERT INTO registrations (name, email, phone, course) VALUES (?, ?, ?, ?)";

  db.query(insertSql, [name, email, phone, course], async (err, result) => {
    if (err) {
      console.error("❌ Database Insert Error:", err);
      return res.status(500).json({ status: "error", message: "Registration failed due to server error." });
    }

    // ✅ Setup Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com',         // 🔁 replace with your Gmail
        pass: 'your_app_password'             // 🔁 replace with your Gmail App Password
      }
    });

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Course Registration Confirmation',
      html: `<p>Hi <strong>${name}</strong>,<br/>You have successfully registered for <strong>${course}</strong>.<br/>Thank you!</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent to:", email);
      return res.json({
        status: "success",
        message: "Registered successfully. Confirmation email sent."
      });
    } catch (emailErr) {
      console.error("❌ Email Sending Error:", emailErr.message);
      return res.json({
        status: "partial",
        message: "Registered, but confirmation email could not be sent."
      });
    }
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
