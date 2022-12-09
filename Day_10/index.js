const fs = require("fs");
const path = require("path");

const main = async () => {
    const lines = readFile("input.txt");

    for (let line of lines) {
        console.log(line);
    }

    console.log("Nothing here");
};


const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

main();
