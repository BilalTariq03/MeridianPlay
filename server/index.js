const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const questionsRouter = require('./routes/questions');

const app  = express();           // ← missing
const PORT = process.env.PORT || 5000;  // ← missing

const allowedOrigins = [
  'http://localhost:5173',
  'https://meridian-play.vercel.app',
  'https://meridianplay.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use('/api/questions', questionsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Trivia Platform API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});