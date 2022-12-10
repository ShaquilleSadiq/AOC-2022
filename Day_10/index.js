const fs = require("fs");
const path = require("path");

let cyc = 0;
let x = 1;
let strength = 0;

const main = async () => {
    const lines = readFile("input.txt");
    const funcs = { noop, addx };

    console.log("P2: ");
    for (let line of lines) {
        const [instruct, num] = line.split(" ");

        funcs[instruct](num);
    }

    console.log("\nP1: ", strength);
};

const addx = (num) => {
    runCycle();
    runCycle();
    x += parseInt(num);
};

const noop = () => runCycle();

const runCycle = () => {
    cyc++;
    const diff = Math.abs(x - ((cyc % 40) - 1));
    const symbol = diff == 0 || diff == 1 ? "█" : ".";
    process.stdout.write(symbol);

    // new line
    if (cyc % 40 == 0) console.log();

    // calulate strength
    if ((cyc - 20) % 40 == 0) strength += cyc * x;
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

main();
