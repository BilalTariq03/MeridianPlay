const axios = require('axios');
const fs = require('fs');
const path = require('path');

const fetchAndCache = async () => {
  console.log('Fetching country data...');

  // Batch 1 — first 10 fields
  const res1 = await axios.get(
    'https://restcountries.com/v3.1/all?fields=name,capital,flags,region,currencies,cca2,ccn3,area,latlng,population'
  );

  // Batch 2 — remaining fields
  const res2 = await axios.get(
    'https://restcountries.com/v3.1/all?fields=cca2,independent'
  );

  // Index batch 2 by country code for fast lookup
  const extra = {};
  res2.data.forEach(c => {
    extra[c.cca2] = { independent: c.independent };
  });

  // Merge both batches
  const countries = res1.data
    .filter(c => c.capital && c.capital.length > 0)
    .map(c => ({
      name:        c.name.common,
      capital:     c.capital[0],
      flag:        c.flags.png,
      region:      c.region,
      currency:    c.currencies,
      code:        c.cca2,
      numericCode: c.ccn3,
      area:        c.area || 0,
      latlng:      c.latlng || [0, 0],
      population:  c.population || 0,
      independent: extra[c.cca2]?.independent || false,
    }));

  const outputPath = path.join(__dirname, 'countries.json');
  fs.writeFileSync(outputPath, JSON.stringify(countries, null, 2));

  console.log(`✅ Saved ${countries.length} countries to countries.json`);
};

fetchAndCache();