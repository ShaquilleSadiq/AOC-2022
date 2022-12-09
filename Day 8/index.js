const fs = require("fs");
const path = require("path");

const grid = [];
let rowCnt = 0;
let colCnt = 0;

const answers = {};

const main = async () => {
    const lines = readFile("input.txt");
    rowCnt = lines.length;
    colCnt = lines[0].length;

    //build grid
    for (const trees of lines) {
        const row = [];

        for (const tree of trees) {
            const height = parseInt(tree);
            row.push(height);
        }
        
        grid.push(row);
    }

    //answers
    for (const [i, row] of Object.entries(grid)) {
        for (const [j, height] of Object.entries(row)) {
            const dir = checkVisibility(parseInt(i), parseInt(j), height);

            if (dir.visible) answers[`${i}:${j}`] = dir;
        }
    }

    let max = 0;

    for (const row of Object.values(answers)) {
        if(row.visible.edge !== 0){
            const temp = row.visible.left * row.visible.right * row.visible.top * row.visible.bottom;
            max = (temp > max) ? temp : max;
        }
    }

    console.log("P1:", Object.entries(answers).length);
    console.log("P2:", max);
};

const checkVisibility = (i, j, height1) => {
    if (i == 0 || j == 0 || i == rowCnt - 1 || j == colCnt - 1) {
        return { height: height1, visible: { edge: 0 } };
    }

    let visible = {};

    let nice = true;
    let temp = 0;
    //left
    for (let k = j-1; k >= 0; k--) {
        const height2 = grid[i][k];

        if (height1 <= height2) {
            temp = k;
            nice = false;
            break;
        }
    }
    (nice) ? visible.left = j : visible.left = j - temp;
    
    //right
    nice = true;
    for (let k = j + 1; k < colCnt; k++) {
        const height2 = grid[i][k];

        if (height1 <= height2) {
            temp = k;
            nice = false;
            break;
        }
    }
    
    (nice) ? visible.right = colCnt-1 - j : visible.right = temp - j;

    //top
    nice = true;
    for (let k = i-1; k >= 0; k--) {
        const height2 = grid[k][j];

        if (height1 <= height2) {
            temp = k;
            nice = false;
            break;
        }
    }
    (nice) ? visible.top = i : visible.top = i - temp;

    //bottom
    nice = true;
    for (let k = i + 1; k < rowCnt; k++) {
        const height2 = grid[k][j];

        if (height1 <= height2) {
            temp = k;
            nice = false;
            break;
        }
    }

    (nice) ? visible.bottom = rowCnt-1 - i : visible.bottom = temp - i;

    return {height: height1, visible: Object.keys(visible).length > 0 ? visible : false};
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

main();
