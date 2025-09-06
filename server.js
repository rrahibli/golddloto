// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // allow cross-origin requests
app.use(bodyParser.json()); // parse JSON bodies

// Root endpoint
app.get('/', (req, res) => {
  res.send('GOLD LOTO backend is running.');
});

// Helper function to generate random lottery codes
function generateCodes(count = 8) {
  const codes = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 6; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }
  return codes;
}

// /buy endpoint
app.post('/buy', (req, res) => {
  const { name, email, ticket } = req.body;

  if (!name || !email || !ticket) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  // Here you can add database logic to save the purchase if needed

  const codes = generateCodes(8);

  res.json({
    success: true,
    codes: codes
  });
});

// Listen on port (Render sets process.env.PORT)
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`GOLD LOTO backend running on port ${PORT}`);
});
