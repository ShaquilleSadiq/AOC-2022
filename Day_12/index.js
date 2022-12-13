const fs = require("fs");
const path_util = require("path");

let start;
let end;
const matrix = [];

const main = async () => {
    const lines = readFile("input.txt");
    const allStarts = [];

    const rowCnt = lines.length;
    const colCnt = lines[0].length;
    const vertCnt = rowCnt * colCnt;

    // build grid
    for (let [i, row] of Object.entries(lines)) {
        lines[i] = row.split("");

        for (let [j, elem] of Object.entries(row)) {
            elem = convert(elem, i, j);

            // start
            if (elem === "S") {
                elem = 0;
                start = parseInt(i) * colCnt + parseInt(j);
            }
            // end
            if (elem === "E") {
                elem = 26;
                end = parseInt(i) * colCnt + parseInt(j);
            }

            // p2
            if (elem === 0) {
                allStarts.push(parseInt(i) * colCnt + parseInt(j));
            }

            lines[i][j] = elem;
        }
    }

    // build adjacency matrix
    for (let i = 0; i < rowCnt; i++) {
        for (let j = 0; j < colCnt; j++) {
            // fill curr vertex with no edges
            let arr = Array(rowCnt * colCnt).fill(Infinity);

            // up
            if (i - 1 >= 0 && lines[i - 1][j] - lines[i][j] <= 1) {
                arr[(i - 1) * colCnt + j] = 1;
            }
            // down
            if (i + 1 < rowCnt && lines[i + 1][j] - lines[i][j] <= 1) {
                arr[(i + 1) * colCnt + j] = 1;
            }
            // left
            if (j - 1 >= 0 && lines[i][j - 1] - lines[i][j] <= 1) {
                arr[i * colCnt + j - 1] = 1;
            }
            // right
            if (j + 1 < colCnt && lines[i][j + 1] - lines[i][j] <= 1) {
                arr[i * colCnt + j + 1] = 1;
            }

            matrix.push(arr);
        }
    }

    let length = findPath(matrix, vertCnt, start, end);
    console.log("P1:", length);

    //p2
    let max = Infinity;
    console.log("\nP2:");

    for (const startV of allStarts) {
        length = findPath(matrix, vertCnt, startV, end, max);

        if (length != 0 && length < max) {
            max = length;
            console.log(`${max}...`);
        }
    }

    console.log("Result:", max);
    return;
};

const convert = (val) => {
    if (val == "S") {
        return val;
    } else if (val == "E") {
        return val;
    } else {
        return val.charCodeAt(0) - 97;
    }
};

const findPath = (matrix, vertCnt, start, end, max = Infinity) => {
    const done = [];
    done[start] = true;

    const pathLengths = [];
    const previous = [];

    for (let i = 0; i < vertCnt; i++) {
        pathLengths[i] = matrix[start][i];
        
        if (matrix[start][i] != Infinity) {
            previous[i] = start;
        }
    }

    pathLengths[start] = 0;

    for (let i = 0; i < vertCnt - 1; i++) {
        let closest = -1;
        let closestDistance = Infinity;

        for (let j = 0; j < vertCnt; j++) {
            if (!done[j] && pathLengths[j] < closestDistance) {
                closestDistance = pathLengths[j];
                closest = j;
            }
        }

        done[closest] = true;

        for (let j = 0; j < vertCnt; j++) {
            if (!done[j] && matrix[closest]) {
                let closer = pathLengths[closest] + matrix[closest][j];

                if (closer < pathLengths[j]) {
                    pathLengths[j] = closer;
                    previous[j] = closest;
                }
            }
        }
    }

    let length = 0;

    while (end != start) {
        length++;

        end = previous[end];

        if (length > max) {
            return 0;
        }
    }

    return length;
};

const readFile = (filename) => fs.readFileSync(path_util.join(__dirname, filename), "utf8").split("\n");

main();
