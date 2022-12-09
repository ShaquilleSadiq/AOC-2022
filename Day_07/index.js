const fs = require("fs");
const path = require("path");

let dir_sizes = [];
let levels = [];

const main = async () => {
    const dirs = [];
    let filename;
    let curr_dir = "";
    const lines = readFile("input.txt");

    let command = "";

    for (const line of lines) {
        if (line[0] === "$") {
            // command
            command = line.substring(2, line.length);
            command = command.split(' ');

            //cd
            if (command[0] === "cd") {
                curr_dir = command[1];
                (curr_dir === "..") ? levels.pop() : levels.push(curr_dir);

                let dir = dirs;

                for (const [i, level] of Object.entries(levels)) {
                    if (parseInt(i) !== levels.length - 1) {
                        dir = dir[level];
                        continue;
                    }

                    dir[level] = dir[level] ? dir[level] : [];
                }
            }

            continue;
        } else {
            //file
            const file = line.split(" ");

            if (file[0] !== "dir") {
                const filesize = file[0];
                filename = file[1];

                let dir = dirs;

                for (const [i, level] of Object.entries(levels)) {
                    if (parseInt(i) !== levels.length - 1) {
                        dir = dir[level];
                        continue;
                    }

                    const new_dir = levels.join('/');
                    dir[level][filename] = filesize;
                    dir_sizes[new_dir] = dir_sizes[new_dir] ? dir_sizes[new_dir] : 0;
                    dir_sizes[new_dir] += parseInt(filesize);
                }
            }
        }
    }

    let total1 = 0;
    let total2 = 0;

    //for p2
    for (const size of Object.values(dir_sizes)) total2 += size;
    let needed = 30000000 - (70000000 - total2);

    //p1
    levels = [];
    dfs(dirs);

    for (const size of Object.values(dir_sizes)) total1 += (size < 100000) ? size : 0;
    console.log("P1:", total1);

    //p2
    const sortedSizes = Object.values(dir_sizes).sort((a, b) => a - b);

    for (const size of sortedSizes) {
        if(size > needed){
            console.log("P2:", size);
            break;
        }
    }
};

const dfs = (data, dirkey = "") => {
    for (const key of Object.keys(data)) {
        const elem = data[key];

        if (typeof elem === "object") {

            dirkey = key;
            levels.push(dirkey);
            dfs(elem, dirkey);
            levels.pop();
        } else {
            for (let i = 0; i < levels.length - 1; i++) {
                const level = [...levels].splice(0, levels.length - i - 1).join('/');

                if (!dir_sizes[level] || isNaN(dir_sizes[level])) dir_sizes[level] = 0;

                dir_sizes[level] += parseInt(elem);
            }
        }
    }
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

main();
