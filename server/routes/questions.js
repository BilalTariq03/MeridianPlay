const express = require('express');
const router = express.Router();
const countries = require('../data/countries.json');

// Helper: pick N random items from array
const getRandom = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

// GET /api/questions/flags
// Returns 10 questions: each has a correct country + 3 wrong options
router.get('/flags', (req, res) => {
  const shuffled = getRandom(countries, 10);

  const questions = shuffled.map(correct => {
    const wrong = getRandom(
      countries.filter(c => c.code !== correct.code),
      3
    );

    const options = getRandom([correct, ...wrong], 4); // shuffle options too

    return {
      flag: correct.flag,
      answer: correct.name,
      options: options.map(o => o.name)
    };
  });

  res.json(questions);
});

module.exports = router;