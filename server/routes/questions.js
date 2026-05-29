const express = require('express');
const router = express.Router();
const countries = require('../data/countries.json');

// Helper: pick N random items from array
const getRandom = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);


// Filter countries by difficulty
const filterByDifficulty = (countries, difficulty) => {
  switch (difficulty) {
    case 'easy':
      return countries.filter(c => c.population >= 30000000);   // 50M+  (~50 countries)
    case 'medium':
      return countries.filter(c => c.population >= 5000000);   // 10M+  (~100 countries)
    case 'hard':
      return countries.filter(c => c.independent === true);     // all independent (~195)
    case 'extreme':
    default:
      return countries;                                          // everything (~246)
  }
};

const getCount = (query, pool) => {
  const requested = parseInt(query.questions) || 10;
  return Math.min(requested, pool.length); // never ask for more than pool has
};

// Extracts the base currency word: "Canadian dollar" → "Dollar"
const simplifyCurrency = (name) => {
  const overrides = {
    'pound sterling': 'Pound',
    'new shekel':     'Shekel',
    'new lira':       'Lira',
    'new dong':       'Dong',
  };

  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(overrides)) {
    if (lower.includes(key)) return val;
  }

  const words = name.split(' ');
  const last  = words[words.length - 1];
  return last.charAt(0).toUpperCase() + last.slice(1);
};


// Helper to get primary language
const getPrimaryLanguage = (languages) => {
  if (!languages || Object.keys(languages).length === 0) return null;
  return Object.values(languages)[0]; // first language listed
};

const getContinent = (country) => {
  if (country.region !== 'Americas') return country.region;

  // Split Americas by subregion
  const sub = country.subregion || '';
  if (sub.includes('South')) return 'South America';
  if (sub.includes('North') || sub.includes('Central') || sub.includes('Caribbean')) {
    return 'North America';
  }
  return 'Americas'; // fallback
};


// GET /api/questions/flags
// Returns 10 questions: each has a correct country + 3 wrong options
router.get('/flags', (req, res) => {
  const difficulty = req.query.difficulty || 'medium';   // default medium
  const pool       = filterByDifficulty(countries, difficulty);
  const count      = getCount(req.query, pool);

  if (pool.length < 4) {
    return res.status(400).json({ error: 'Not enough countries for this difficulty' });
  }

  const shuffled = getRandom(pool, count);

  const questions = shuffled.map(correct => {
    const wrong = getRandom(
      pool.filter(c => c.code !== correct.code),
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


// GET /api/questions/capitals
// Shows country name → pick the correct capital
router.get('/capitals', (req, res) => {
  const difficulty = req.query.difficulty || 'medium';   // default medium
  const pool       = filterByDifficulty(countries, difficulty);
  const count      = getCount(req.query, pool);

  if (pool.length < 4) {
    return res.status(400).json({ error: 'Not enough countries for this difficulty' });
  }

  const shuffled = getRandom(pool, count);

  const questions = shuffled.map(correct => {
    const wrong = getRandom(
      pool.filter(c => c.code !== correct.code),
      3
    );

    const options = getRandom([correct, ...wrong], 4);

    return {
      question: correct.name,      // show the country name
      answer: correct.capital,     // correct answer is the capital
      options: options.map(o => o.capital),
    };
  });

  res.json(questions);
});


// GET /api/questions/map-location
// Returns a highlighted country (by numeric code) → pick the country name
router.get('/map-location', (req, res) => {
  const difficulty = req.query.difficulty || 'medium';   // default medium
  const pool       = filterByDifficulty(countries, difficulty);
  const count      = getCount(req.query, pool);

  if (pool.length < 4) {
    return res.status(400).json({ error: 'Not enough countries for this difficulty' });
  }

  const eligible = pool.filter(c =>
    c.numericCode &&
    c.numericCode !== '' &&
    c.area > 500        // filter out microstates (smaller than ~10,000 km²)
  );

  const shuffled = getRandom(eligible, count);

  const questions = shuffled.map(correct => {
    const wrong   = getRandom(eligible.filter(c => c.code !== correct.code), 3);
    const options = getRandom([correct, ...wrong], 4);

    return {
      numericCode: correct.numericCode,
      answer:      correct.name,
      options:     options.map(o => o.name),
      region:      correct.region,
      latlng:      correct.latlng,              // ADD THIS
      area:        correct.area,                // ADD THIS
    };
  });

  res.json(questions);
});

// Get currencies
router.get('/currencies', (req, res) => {
  const difficulty = req.query.difficulty || 'medium';   // default medium
  const pool       = filterByDifficulty(countries, difficulty);
  const count      = getCount(req.query, pool);

  if (pool.length < 4) {
    return res.status(400).json({ error: 'Not enough countries for this difficulty' });
  }

  const eligible = pool.filter(c =>
    c.currency &&
    Object.keys(c.currency).length > 0 &&
    Object.values(c.currency)[0]?.name
  );

  const shuffled = getRandom(eligible, count);

  const questions = shuffled.map(correct => {
    const correctCurrencyName     = Object.values(correct.currency)[0].name;
    const correctCurrencySimple   = simplifyCurrency(correctCurrencyName);

    // Wrong options: different simplified name from correct AND from each other
    const used = new Set([correctCurrencySimple]);
    const wrong = [];

    const candidates = getRandom(eligible.filter(c => c.code !== correct.code), 50);

    for (const country of candidates) {
      if (wrong.length === 3) break;
      const name   = Object.values(country.currency)[0]?.name;
      if (!name) continue;
      const simple = simplifyCurrency(name);
      if (!used.has(simple)) {
        used.add(simple);
        wrong.push(simple);
      }
    }

    const options = getRandom([correctCurrencySimple, ...wrong], 4);

    return {
      question: correct.name,
      flag:     correct.flag,
      answer:   correctCurrencySimple,
      options,
    };
  });

  res.json(questions);
});




// GET /api/questions/languages
// Shows country flag + name → pick the language
router.get('/languages', (req, res) => {
  const difficulty = req.query.difficulty || 'medium';
  const pool       = filterByDifficulty(countries, difficulty).filter(c =>
    c.languages && Object.keys(c.languages).length > 0
  );

  if (pool.length < 4) {
    return res.status(400).json({ error: 'Not enough countries for this difficulty' });
  }

  const count    = getCount(req.query, pool);
  const shuffled = getRandom(pool, count);

  const questions = shuffled.map(correct => {
    const correctLang = getPrimaryLanguage(correct.languages);
    const used        = new Set([correctLang]);
    const wrong       = [];

    const candidates = getRandom(
      pool.filter(c => c.code !== correct.code),
      50
    );

    for (const c of candidates) {
      if (wrong.length === 3) break;
      const lang = getPrimaryLanguage(c.languages);
      if (lang && !used.has(lang)) {
        used.add(lang);
        wrong.push(lang);
      }
    }

    const options = getRandom([correctLang, ...wrong], 4);

    return {
      question: correct.name,
      flag:     correct.flag,
      answer:   correctLang,
      options,
    };
  });

  res.json(questions);
});



router.get('/continents', (req, res) => {
  const difficulty = req.query.difficulty || 'medium';
  const pool       = filterByDifficulty(countries, difficulty);

  if (pool.length < 4) {
    return res.status(400).json({ error: 'Not enough countries for this difficulty' });
  }

  const count    = getCount(req.query, pool);
  const shuffled = getRandom(pool, count);

  const ALL_CONTINENTS = [
    'Africa',
    'North America',
    'South America',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  const questions = shuffled.map(correct => {
    const correctContinent = getContinent(correct);
    const wrong   = getRandom(
      ALL_CONTINENTS.filter(c => c !== correctContinent),
      3
    );
    const options = getRandom([correctContinent, ...wrong], 4);

    return {
      question: correct.name,
      flag:     correct.flag,
      answer:   correctContinent,
      options,
    };
  });

  res.json(questions);
});

module.exports = router;