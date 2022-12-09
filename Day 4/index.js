const fs = require("fs");
const path = require("path");

const main = async () => {
    const arr = readFile("input.txt");
    let total1 = 0;
    let total2 = 0;

    for (const ass of arr) {
        [pair1, pair2] = ass.split(",");
        [p1A, p1B] = pair1.split("-");
        [p2A, p2B] = pair2.split("-");
        
        if((num(p1A) >= num(p2A) && num(p1B) <= num(p2B)) || (num(p2A) >= num(p1A) && num(p2B) <= num(p1B))) total1++;
        if(num(p1A) <= num(p2B) && num(p1B) >= num(p2A)) total2++;
    }

    console.log("P1:", total1);
    console.log("P2:", total2);
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");
const num = (n) => parseInt(n);

main();