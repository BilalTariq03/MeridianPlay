const axios = require('axios');
const fs = require('fs');
const path = require('path');

const fetchAndCache = async () => {
  console.log('Fetching country data...');

  const response = await axios.get(
    'https://restcountries.com/v3.1/all?fields=name,capital,flags,region,independent,currencies,cca2'
  );

  // Clean and simplify the data
  const countries = response.data
    .filter(c => c.capital && c.capital.length > 0) // only countries with a capital
    .map(c => ({
      name: c.name.common,
      capital: c.capital[0],
      flag: c.flags.png,
      region: c.region,
      independent: c.independent,
      currency: c.currencies,
      code: c.cca2
    }));

  const outputPath = path.join(__dirname, 'countries.json');
  fs.writeFileSync(outputPath, JSON.stringify(countries, null, 2));

  console.log(`✅ Saved ${countries.length} countries to countries.json`);
};

fetchAndCache();