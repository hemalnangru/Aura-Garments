require("dotenv").config();

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* IMPORTANT:
   make sure file names match exactly:
   ./models/User.js
   ./models/Order.js
*/
const User = require("./models/user");
const Order = require("./models/orders");

/* MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "aura"
  })
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Error:");
    console.log(err.message);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* Email Transporter */
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

/* CHECKOUT API */
app.post("/api/checkout", async (req, res) => {
  try {
    const { orderId, total, email, cart, payment, invoiceBase64 } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const transporter = createTransporter();

    let cartHtml = `
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:8px; border-bottom:1px solid #ddd; text-align:left;">Item</th>
            <th style="padding:8px; border-bottom:1px solid #ddd; text-align:right;">Qty</th>
            <th style="padding:8px; border-bottom:1px solid #ddd; text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
    `;

    cart.forEach((item) => {
      cartHtml += `
        <tr>
          <td style="padding:8px; border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">${item.quantity}</td>
          <td style="padding:8px; border-bottom:1px solid #eee; text-align:right;">₹${parseFloat(item.price).toFixed(2)}</td>
        </tr>
      `;
    });

    cartHtml += `
        </tbody>
        <tfoot>
          <tr>
            <th colspan="2" style="padding:8px; text-align:right;">Total</th>
            <th style="padding:8px; text-align:right;">₹${total}</th>
          </tr>
        </tfoot>
      </table>
    `;

    const mailOptions = {
      from: `"Aura Garments" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto;">
          <h2>Thank you for your order!</h2>
          <p>We've received your order <strong>${orderId}</strong>.</p>
          <p><strong>Payment Method:</strong> ${payment}</p>
          <h3>Order Details:</h3>
          ${cartHtml}
          <br>
          <p>Please find your invoice attached.</p>
          <p>Best regards,<br>Aura Garments Team</p>
        </div>
      `
    };

    if (invoiceBase64) {
      mailOptions.attachments = [
        {
          filename: `Aura-Invoice-${orderId}.pdf`,
          path: invoiceBase64
        }
      ];
    }

    await transporter.sendMail(mailOptions);

    /* SAVE ORDER IN MONGODB */
    await Order.create({
      orderId,
      email,
      cart,
      total,
      payment
    });

    res.json({
      success: true,
      message: "Order placed successfully! Email sent."
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order"
    });
  }
});

/* SIGNUP API */
app.post("/api/signup", async (req, res) => {
  try {

    const name = req.body.name?.trim();
    const password = req.body.password?.trim();
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      email: email
    });
    console.log("Signup Email:", email);
    console.log("Existing User:", existingUser);

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Aura Garments" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Aura Garments, ${name}!`,
      html: `
        <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto;">
          <h2>Welcome to Aura Garments!</h2>
          <p>Hi ${name},</p>
          <p>Your account has been created successfully.</p>
          <p>Enjoy shopping with Aura Garments.</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: "Signup successful"
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
});

/* LOGIN API */
app.post("/api/login", async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        success: false,
        message: "Wrong password"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});