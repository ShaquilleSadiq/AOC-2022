const fs = require("fs");
const path = require("path");

//debugger vars
let xmax = 0;
let ymax = 0;
let xmin = 0;
let ymin = 0;

const knots = [];
const knotCnt = 10; //p1: 2, p2: 10
const knotEnd = knotCnt - 1;
const been = {};

const main = async () => {
    const funcs = { L: left, R: right, U: up, D: down };
    const lines = readFile("input.txt");

    //populate knots
    for (let k = 0; k < knotCnt; k++) knots[k] = { x: 0, y: 0 };

    //movements
    for (let line of lines) {
        line = line.split(" ");
        const dir = line[0];
        const cnt = parseInt(line[1]);

        for (let i = 0; i < cnt; i++) funcs[dir](dir);
    }

    // grid();
    console.log("Been:", Object.entries(been).length);
};


const gethead = () => knots[0];
const left = () => move(-1, 0);
const right = () => move(1, 0);
const up = () => move(0, -1);
const down = () => move(0, 1);

const move = (xval, yval) => {
    xval && (gethead().x += xval);
    yval && (gethead().y += yval);

    for (let k = 1; k < knots.length; k++) {
        const head = knots[k - 1];
        const tail = knots[k];

        const xdiff = head.x - tail.x;
        const ydiff = head.y - tail.y;

        //diagonal touching
        if (Math.abs(xdiff) == 1 && Math.abs(ydiff) == 1) {
            continue;
        }

        // if the head is two steps directly in any direction
        if (Math.abs(xdiff) >= 2 && ydiff == 0) {
            tail.x = head.x - Math.abs(xdiff) / xdiff;
        } else if (Math.abs(ydiff) >= 2 && xdiff == 0) {
            tail.y = head.y - Math.abs(ydiff) / ydiff;
        }
        // Otherwise, if the head and tail aren't touching and aren't in the same row or column, the tail always moves one step diagonally to keep up:
        else if (Math.abs(xdiff) >= 1 && Math.abs(ydiff) >= 1) {
            tail.x += Math.abs(xdiff) / xdiff;
            tail.y += Math.abs(ydiff) / ydiff;
        }

        log();
    }
};

const log = () => {
    been[`${knots[knotEnd].y}:${knots[knotEnd].x}`] = true;

    // for display
    incmins();
    incmaxes();
};

// debugger utils
const incmins = () => {
    xmin = knots[0].x < xmin ? knots[0].x : xmin;
    ymin = knots[0].y < ymin ? knots[0].y : ymin;

    xmin = knots[knotEnd].x < xmin ? knots[knotEnd].x : xmin;
    ymin = knots[knotEnd].y < ymin ? knots[knotEnd].y : ymin;
};

const incmaxes = () => {
    xmax = knots[0].x > xmax ? knots[0].x : xmax;
    ymax = knots[0].y > ymax ? knots[0].y : ymax;

    xmax = knots[knotEnd].x > xmax ? knots[knotEnd].x : xmax;
    ymax = knots[knotEnd].y > ymax ? knots[knotEnd].y : ymax;
};

//display grid for debugging
const grid = () => {
    for (let i = ymin; i <= ymax; i++) {
        for (let j = xmin; j <= xmax; j++) {
            let symbol = ".";

            for (let k = 0; k < knots.length; k++) {
                const knot = knots[k];

                if (i == knot.y && j == knot.x) {
                    symbol = k == 0 ? "H" : k.toString();
                    break;
                }
            }

            process.stdout.write(symbol);
        }

        console.log();
    }
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

main();
