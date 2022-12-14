const fs = require("fs");
const path = require("path");
const lodash = require("lodash");

let xmax = 0;
let xmin = 500;
let ymax = 0;
let ymin = 0;
let grid1 = [];
let grid2 = [];

const p1 = async () => {
    const grid = [...grid1];

    let count = 0;

    while (true) {
        let sand = { x: 500, y: 0 };
        let prev_count = count;

        for (let i = ymin; i <= ymax; i++) {
            for (let j = xmin; j <= xmax; j++) {
                grid[i] = grid[i] ? grid[i] : [];

                if (sand.y === i && sand.x === j) {
                    grid[i + 1] = grid[i + 1] ? grid[i + 1] : [];

                    //down
                    if (!grid[i + 1][j]) {
                        sand.y++;
                    }
                    //down left
                    else if (j - 1 >= 0 && !grid[i + 1][j - 1]) {
                        sand.x--;
                        sand.y++;
                    }
                    //down right
                    else if (j + 1 <= xmax && !grid[i + 1][j + 1]) {
                        sand.x++;
                        sand.y++;
                    } else {
                        grid[sand.y][sand.x] = "O";
                        count++;
                    }
                }
            }
        }

        // count didnt change so no new sand blocks
        if (prev_count === count) {
            break;
        }
    }

    console.log("\nDRAWING");
    printGrid(grid);

    console.log("\nP1: " + count + "\n");
};

const p2 = async () => {
    const grid = [...grid2];

    let count = 0;
    let temp = 0;
    ymax += 2;
    grid[ymax] = [];

    // start building infinite floor
    for (let j = 0; j <= xmax + 10; j++) {
        grid[ymax][j] = "#";
    }

    while (true) {
        let sand = { x: 500, y: 0 };

        let xmin2 = 500;
        let xmax2 = 500;

        for (let i = ymin; i <= ymax; i++) {
            for (let j = xmin2; j <= xmax2; j++) {
                if (i + 1 === ymax) {
                    grid[i + 1][j] = "#";
                }

                let symbol = ".";
                grid[i] = grid[i] ? grid[i] : [];

                if (sand.y === i && sand.x === j) {
                    symbol = "+";
                    grid[i + 1] = grid[i + 1] ? grid[i + 1] : [];

                    //down
                    if (!grid[i + 1][j]) {
                        sand.y++;
                    }
                    //down left
                    else if (j - 1 >= 0 && !grid[i + 1][j - 1]) {
                        sand.x--;
                        sand.y++;
                        xmin--;
                        xmin2--;
                    }
                    //down right
                    else if (!grid[i + 1][j + 1]) {
                        sand.x++;
                        sand.y++;
                        xmax++;
                        xmax2++;
                    } else {
                        grid[sand.y][sand.x] = "O";
                        symbol = "O";
                        count++;
                    }
                }

                if (grid[i] && grid[i][j]) {
                    symbol = grid[i][j];
                }
            }
        }

        if (sand.x === 500 && sand.y === 0) {
            break;
        }

        if (Math.abs(count - temp) > 10) {
            temp = count;
            process.stdout.moveCursor(0, -1);
            process.stdout.clearLine(1);
            console.log(count);
        }
    }

    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    console.log("P2: " + count);
};

const printGrid = (grid) => {
    for (let i = ymin; i <= ymax; i++) {
        process.stdout.write(`${i} `);

        for (let j = xmin; j <= xmax; j++) {
            let symbol = ".";

            if (grid[i] && grid[i][j]) {
                symbol = grid[i][j];
            }

            process.stdout.write(symbol);
        }
        console.log();
    }
};

const buildGrid = () => {
    const lines = readFile("input.txt");
    const grid = [];

    for (let line of lines) {
        const path = line.split(" -> ");

        const path_points = [];

        for (let point of path) {
            point = point.split(",");
            const x = parseInt(point[0]);
            const y = parseInt(point[1]);
            path_points.push({ x, y });
        }

        for (let i = 1; i < path_points.length; i++) {
            const p1 = path_points[i - 1];
            const p2 = path_points[i];

            const x_change = p1.x != p2.x;

            let n1 = x_change ? p1.x : p1.y;
            let n2 = x_change ? p2.x : p2.y;
            let cond = n1 < n2 ? (j) => j <= n2 : (j) => j >= n2;

            if (x_change) {
                ymax = p1.y > ymax ? p1.y : ymax;
                ymin = p1.y < ymin ? p1.y : ymin;

                let temp = p1.x > p2.x ? p1.x : p2.x;
                xmax = temp > xmax ? temp : xmax;

                temp = p1.x < p2.x ? p1.x : p2.x;
                xmin = temp < xmin ? temp : xmin;
            } else {
                xmax = p1.x > xmax ? p1.x : xmax;
                xmin = p1.x < xmin ? p1.x : xmin;

                let temp = p1.y > p2.y ? p1.y : p2.y;
                ymax = temp > ymax ? temp : ymax;

                temp = p1.y < p2.y ? p1.y : p2.y;
                ymin = temp < ymin ? temp : ymin;
            }

            for (let j = n1; cond(j); n1 < n2 ? j++ : j--) {
                const p1 = path_points[i - 1];

                if (x_change) {
                    grid[p1.y] = grid[p1.y] ? grid[p1.y] : [];
                    grid[p1.y][j] = "#";
                } else {
                    grid[j] = grid[j] ? grid[j] : [];
                    grid[j][p1.x] = "#";
                }
            }
        }
    }

    grid1 = grid;
    grid2 = lodash.cloneDeep(grid);
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

const main = async () => {
    buildGrid();
    p1();
    p2();
};

main();
