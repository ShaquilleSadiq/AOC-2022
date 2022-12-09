const fs = require("fs");
const path = require("path");

const main = async () => {
    const elfArr = readFile("input.txt");
    const resultArr = [];
    let i = 0;

    for (const elf of elfArr) {
        //individual elf
        let total = 0;
        const calArr = elf.split("\n");

        //individual calories
        for (const cal of calArr) total += parseInt(cal);

        i++;
        resultArr.push(total);
    }

    resultArr.sort();
    console.log(resultArr[i - 2] + resultArr[i - 3] + resultArr[i - 4]);
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n\n");

main();
