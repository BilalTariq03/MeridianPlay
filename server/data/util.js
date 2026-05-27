const fs = require("fs");

const rawData = fs.readFileSync("./data/countries.json", "utf-8");
const data = JSON.parse(rawData);

const countries = data.filter(country => country.population >= 5000000);

console.log(countries.length);