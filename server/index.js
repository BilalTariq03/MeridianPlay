const express = require('express');
const cors = require('cors');
require('dotenv').config();
const questionsRouter = require('./routes/questions');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/questions', questionsRouter);


// Health check — just to confirm server is running
app.get('/', (req, res) => {
  res.json({ message: 'Trivia Platform API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});