const fs = require("fs");
const path = require("path");

const p2 = async () => {
    const arr = readFile("input.txt");
    let total = 0;

    for (let i = 0; i < arr.length - 2; i += 3) {
        const sack1 = [...arr[i + 0]];
        const sack2 = [...arr[i + 1]];
        const sack3 = [...arr[i + 2]];

        let result = sack1.filter((char) => sack2.includes(char));
        result = result.filter((char) => sack3.includes(char));

        const char = result[0];

        const val = isUpper(char) ? (64-26) : 96;
        total += char.charCodeAt(0) - val;
    }

    console.log(total);
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");
const isUpper = (char) => char == char.toUpperCase();

module.exports = {p2};