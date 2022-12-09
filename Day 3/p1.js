const fs = require("fs");
const path = require("path");

const p1 = async () => {
    const arr = readFile("input.txt");
    let total = 0;

    for (const sack of arr) {
        const len = sack.length;
        const comp1 = [...sack.slice(0, len / 2)];
        const comp2 = [...sack.slice(len / 2, len)];

        const result = comp1.filter((char) => comp2.includes(char));

        const char = result[0];

        const val = isUpper(char) ? (64-26) : 96;
        total += char.charCodeAt(0) - val;
    }

    console.log(total);
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");
const isUpper = (char) => char == char.toUpperCase();

module.exports = {p1};
