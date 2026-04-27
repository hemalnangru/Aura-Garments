const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Configure Real Email (Gmail)
function createTransporter() {
  // Replace these with your actual Gmail credentials.
  // NOTE: You MUST use an "App Password", not your regular Gmail password.
  // To get an App Password: Go to Google Account -> Security -> 2-Step Verification -> App Passwords
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'YOUR_GMAIL_ADDRESS@gmail.com', // ⚠️ Replace this
      pass: 'YOUR_APP_PASSWORD',            // ⚠️ Replace this
    },
  });
}

app.post("/api/checkout", async (req, res) => {
  try {
    const { orderId, total, email, cart, payment, invoiceBase64 } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const transporter = createTransporter();

    // Create an HTML table for the cart items
    let cartHtml = `<table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
          <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">Qty</th>
          <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>`;
    
    cart.forEach(item => {
      cartHtml += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${parseFloat(item.price).toFixed(2)}</td>
        </tr>`;
    });

    cartHtml += `
      </tbody>
      <tfoot>
        <tr>
          <th colspan="2" style="padding: 8px; text-align: right;">Total</th>
          <th style="padding: 8px; text-align: right;">₹${total}</th>
        </tr>
      </tfoot>
    </table>`;

    let mailOptions = {
      from: '"Aura Garments" <no-reply@auragarments.com>',
      to: email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for your order!</h2>
          <p>Hi there,</p>
          <p>We've received your order <strong>${orderId}</strong> and are getting it ready for shipment.</p>
          <p><strong>Payment Method:</strong> ${payment}</p>
          <h3>Order Details:</h3>
          ${cartHtml}
          <br>
          <p>Please find your official invoice attached to this email.</p>
          <p>If you have any questions, simply reply to this email.</p>
          <p>Best regards,<br>Aura Garments Team</p>
        </div>
      `,
    };

    if (invoiceBase64) {
      mailOptions.attachments = [
        {
          filename: `Aura-Invoice-${orderId}.pdf`,
          path: invoiceBase64
        }
      ];
    }

    // Send email
    let info = await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: "Order placed successfully! Real confirmation email sent."
    });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send confirmation email" });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const transporter = createTransporter();

    let mailOptions = {
      from: '"Aura Garments" <no-reply@auragarments.com>',
      to: email,
      subject: `Welcome to Aura Garments, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Aura Garments!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for creating an account with us. We're thrilled to have you here.</p>
          <p>Get ready to explore our premium collections and enjoy a seamless shopping experience.</p>
          <br>
          <p>Best regards,<br>Aura Garments Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Welcome email sent" });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ success: false, message: "Failed to send welcome email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});