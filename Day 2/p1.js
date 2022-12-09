const fs = require("fs");
const path = require("path");

const p1 = async () => {
    const roundArr = readFile("input.txt");
    let totalscore = 0;

    for (const round of roundArr) {
        //individual round
        const myMove = round[2];
        const yourMove = round[0];
        let score = 0;


        switch (yourMove) {
            case "A":
                if (myMove == "Y") {
                    //win
                    score += 6 + 2;
                } else if (myMove == "Z") {
                    //loss
                    score += 0 + 3;
                } else {
                    //draw
                    score += 3 + 1;
                }
                break;
            case "B":
                if (myMove == "Z") {
                    //win
                    score += 6 + 3;
                } else if (myMove == "X") {
                    //loss
                    score += 0 + 1;
                } else {
                    //draw
                    score += 3 + 2;
                }
                break;
            case "C":
                if (myMove == "X") {
                    //win
                    score += 6 + 1;
                } else if (myMove == "Y") {
                    //loss
                    score += 0 + 2;
                } else {
                    //draw
                    score += 3 + 3;
                }
                break;
            default:
                break;
        }

        totalscore += score;
    }

    console.log("P1:", totalscore);
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

module.exports = {p1};
