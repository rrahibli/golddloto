import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4242;
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const CURRENCY = process.env.CURRENCY || "AZN";

// Generate 8 random codes
function generateCodes() {
  const codes = [];
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 8; i++) {
    let code = "";
    for (let j = 0; j < 6; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    codes.push(code);
  }
  return codes;
}

// Prices for your tickets (AZN)
const ticketPrices = {
  "Bürünc - ₼2": 2,
  "Gümüş - ₼4": 4,
  "Qızıl - ₼6": 6,
};

// Create payment endpoint
app.post("/buy", async (req, res) => {
  const { name, email, ticket } = req.body;

  if (!ticketPrices[ticket]) {
    return res.status(400).json({ success: false, message: "Invalid ticket" });
  }

  const amount = ticketPrices[ticket];

  try {
    // Create NOWPayments payment
    const response = await axios.post(
      "https://api.nowpayments.io/v1/payment",
      {
        price_amount: amount,
        price_currency: CURRENCY, // AZN
        pay_currency: "usdt", // user can pay in crypto (e.g., USDT)
        order_id: Date.now().toString(),
        order_description: `${ticket} for ${name} (${email})`,
        ipn_callback_url: "https://goldloto-az.onrender.com/ipn", // webhook later
      },
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = response.data;

    // Respond with payment URL
    res.json({
      success: true,
      payment_url: payment.invoice_url,
    });
  } catch (err) {
    console.error("NOWPayments error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
