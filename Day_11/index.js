const fs = require("fs");
const path = require("path");

let monkeys = [];
let monkeysIns = [];
let modnum = 1;

const itemOp = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
};

const main = async (partStr, rounds, callback) => {
    const file = readFile("input.txt");
    monkeys = [];
    monkeysIns = [];
    modnum = 1;

    //build monkeys
    for (const monkeyData of file) {
        const monkey = newMonkey(monkeyData);
    }

    for (let i = 0; i < rounds; i++) {
        for (const [ind, monkey] of Object.entries(monkeys)) {
            monkey.starting_items = monkey.starting_items.filter((item) => {
                //inspect
                monkeysIns[ind]++;
                item = itemOp[monkey.op.sym](item, monkey.op.num !== "old" ? monkey.op.num : item);

                //part specific mod/division
                item = callback(item);

                //throw to
                if (item % monkey.test.cond === 0) {
                    monkeys[monkey.test.t].starting_items.push(item);
                    return false;
                } else {
                    monkeys[monkey.test.f].starting_items.push(item);
                    return false;
                }
            });
        }
    }

    //sort array
    monkeysIns.sort((a, b) => b - a);

    //results
    console.log(partStr, monkeysIns[0] * monkeysIns[1]);
};

//parse individual monkeys
const newMonkey = (monkey) => {
    const lines = monkey.split("\n");

    const index = parseInt(lines[0].split(" ")[1]);
    const starting_items = lines[1].split(": ")[1].split(", ").map((el) => parseInt(el));
    const op = lines[2].split(": new = old ")[1].split(" ");
    const sym = op[0];
    const num = !isNaN(op[1]) ? parseInt(op[1]) : op[1];
    const cond = parseInt(lines[3].split(": divisible by ")[1]);
    const t = parseInt(lines[4].split(": throw to monkey ")[1]);
    const f = parseInt(lines[5].split(": throw to monkey ")[1]);

    monkeys[index] = {starting_items, op: { sym, num }, test: { cond, t, f }};
    monkeysIns[index] = 0;
    modnum *= cond;

    return monkeys[index];
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n\n");

main("P1:", 20, (item) => Math.floor(item / 3));
main("P2:", 10000, (item) => item % modnum);
