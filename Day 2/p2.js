const fs = require("fs");
const path = require("path");

const p2 = async () => {
    const roundArr = readFile("input.txt");
    let totalscore = 0;

    for (const round of roundArr) {
        //individual round
        const myMove = round[2];
        const yourMove = round[0];
        let score = 0;

        switch (yourMove) {
            case "A":
                switch (myMove) {
                    case "X":
                        score += 0 + 3;
                        break;
                    case "Y":
                        score += 3 + 1;
                        break;
                    case "Z":
                        score += 6 + 2;
                        break;
                }
                break;
            case "B":
                switch (myMove) {
                    case "X":
                        score += 0 + 1;
                        break;
                    case "Y":
                        score += 3 + 2;
                        break;
                    case "Z":
                        score += 6 + 3;
                        break;
                }
                break;
            case "C":
                switch (myMove) {
                    case "X":
                        score += 0 + 2;
                        break;
                    case "Y":
                        score += 3 + 3;
                        break;
                    case "Z":
                        score += 6 + 1;
                        break;
                }
                break;
            default:
                break;
        }

        totalscore += score;
    }

    console.log("P2:", totalscore);
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

module.exports = {p2};
