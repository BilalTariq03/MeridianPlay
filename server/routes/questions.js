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

// GET /api/questions/map-location
// Returns a highlighted country (by numeric code) → pick the country name
router.get('/map-location', (req, res) => {
  // Exclude microstates — too tiny to see on world map
  const eligible = countries.filter(c => c.numericCode && c.numericCode !== '');
  const shuffled  = getRandom(eligible, 10);

  const questions = shuffled.map(correct => {
    const wrong   = getRandom(eligible.filter(c => c.code !== correct.code), 3);
    const options = getRandom([correct, ...wrong], 4);

    return {
      numericCode: correct.numericCode,   // used to highlight on the map
      answer: correct.name,
      options: options.map(o => o.name),
      region: correct.region,             // useful for zooming later
    };
  });

  res.json(questions);
});

// GET /api/questions/currencies
// Returns country name → pick the correct currency
router.get('/currencies', (req, res) => {
  // Only include countries with valid currency data
  const eligible = countries.filter(c =>
    c.currency &&
    Object.keys(c.currency).length > 0 &&
    Object.values(c.currency)[0]?.name
  );

  const shuffled = getRandom(eligible, 10);

  const questions = shuffled.map(correct => {
    const correctCurrency = Object.values(correct.currency)[0].name;

    const wrong = getRandom(
      eligible.filter(c => c.code !== correct.code),
      3
    ).map(c => Object.values(c.currency)[0].name);

    // Avoid duplicate currency names in options
    const uniqueWrong = [...new Set(wrong)].slice(0, 3);
    const options = getRandom([correctCurrency, ...uniqueWrong], 4);

    return {
      question: correct.name,       // show country name
      flag: correct.flag,           // show flag alongside for visual interest
      answer: correctCurrency,
      options,
    };
  });

  res.json(questions);
});

module.exports = router;