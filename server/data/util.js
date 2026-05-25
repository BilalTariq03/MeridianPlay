const fs = require("fs");

const rawData = fs.readFileSync("./data/countries.json", "utf-8");
const data = JSON.parse(rawData);

console.log(data.length);