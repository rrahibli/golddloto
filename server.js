const express = require('express');
const app = express();

// Route for homepage
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// Helper function to generate random codes
function generateCodes(count) {
  const codes = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }

  return codes;
}

// Route for success page (simulates after payment)
app.get('/success', (req, res) => {
  const codes = generateCodes(8);

  let html = `
    <h1>🎉 Payment Successful!</h1>
    <p>Here are your 8 random lottery codes:</p>
    <ul>
      ${codes.map(c => `<li>${c}</li>`).join('')}
    </ul>
  `;

  res.send(html);
});

app.listen(4242, () => {
  console.log('🚀 Server running at http://localhost:4242');
});
