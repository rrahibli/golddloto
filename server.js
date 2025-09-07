require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4242;
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY; // Set this in Render Environment tab

app.use(cors());
app.use(bodyParser.json());

// Ticket prices in AZN
const ticketPrices = {
  "Bürünc - ₼2": 2,
  "Gümüş - ₼4": 4,
  "Qızıl - ₼6": 6
};

// Helper: generate 8 random lottery codes
function generateCodes() {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return codes;
}

// Endpoint: Buy ticket
app.post('/buy', async (req, res) => {
  const { name, email, ticket } = req.body;

  if (!name || !email || !ticket) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const price = ticketPrices[ticket];
  if (!price) return res.status(400).json({ success: false, message: 'Invalid ticket' });

  try {
    // Create NowPayments invoice (without buyer_email)
    const invoice = await axios.post('https://api.nowpayments.io/v1/invoice', {
      price_amount: price,
      price_currency: 'AZN',
      pay_currency: 'AZN',
      order_id: Math.floor(Math.random() * 1000000),
      order_description: `GOLD LOTO - ${ticket}`,
      ipn_callback_url: 'https://golddloto-5.onrender.com/ipn'
    }, {
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const codes = generateCodes();

    return res.json({
      success: true,
      invoice_url: invoice.data.invoice_url,
      codes
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ success: false, message: 'Payment creation failed' });
  }
});

// Dummy IPN endpoint for NOWPayments
app.post('/ipn', (req, res) => {
  res.status(200).send('OK');
});

// Health check
app.get('/', (req, res) => {
  res.send('GOLD LOTO backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});