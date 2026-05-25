const fs = require("fs");

const rawData = fs.readFileSync("./data/countries.json", "utf-8");
const data = JSON.parse(rawData);

const countries = data.filter(country => country.independent === true);

console.log(countries.length);