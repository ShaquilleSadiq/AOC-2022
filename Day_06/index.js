const fs = require("fs");
const path = require("path");

const main = async (partLabel, num) => {
    const data = readFile("input.txt");
    
    for (let i = num-1; i < data.length; i++) {
        const arr = [];

        for(let j = num-1; j >= 0; j--) arr.push(data[i-j]);

        const combo = new Set(arr);
        if(combo.size === num){
            console.log(partLabel, i+1);
            break;
        }
    }
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8");

//p1
main("P1:", 4);

//p2
main("P2:", 14);
