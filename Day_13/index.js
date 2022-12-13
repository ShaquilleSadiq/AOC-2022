const fs = require("fs");
const path = require("path");

let order = [];
let idx = 0;

const main = async () => {
    const lines = readFile("input.txt");
    const final = [];

    // build arrays
    for (let [i, line] of Object.entries(lines)) {
        idx = parseInt(i) + 1;

        const arr1 = JSON.parse(line.split("\n")[0]);
        const arr2 = JSON.parse(line.split("\n")[1]);

        final.push(arr1);
        final.push(arr2);

        if (compare(arr1, arr2)) continue;
    }

    // calculate sum
    let sum = 0;
    order.forEach((num) => (sum += num));
    console.log("P2:", sum);

    const ordered = [];

    // add dividers and add first elem for sorting
    final.push([2]);
    final.push([6]);

    for (let [i, entry] of Object.entries(final)) ordered.push([i, dig(entry)]);

    ordered.sort((a, b) => (!Array.isArray(a[1]) ? parseInt(a[1]) : 0) - (!Array.isArray(b[1]) ? parseInt(b[1]) : 0));

    let mult = 1;

    let x, y;
    for (let [i, entry] of Object.entries(ordered)) {
        if (!x && entry[1] === 2) x = parseInt(i) + 1;
        if (!y && entry[1] === 6) y = parseInt(i) + 1;
    }

    mult = x * y;

    console.log("P2:", mult);
};

const compare = (arr1, arr2) => {
    if (arr1 === undefined) {
        order.push(idx);
        return true;
    } else if (arr2 === undefined) return true;

    if (Array.isArray(arr1) || Array.isArray(arr2)) {
        if (!Array.isArray(arr1)) arr1 = [arr1];
        else if (!Array.isArray(arr2)) arr2 = [arr2];

        for (let i = 0; i < arr1.length || i < arr2.length; i++) if (compare(arr1[i], arr2[i])) return true;
        
    } else if (arr1 < arr2) {
        order.push(idx);
        return true;
    } else if (arr1 > arr2) return true;

    return false;
};

const dig = (arr) => {
    if (Array.isArray(arr) && arr.length > 0) return dig(arr[0])

    return arr;
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n\n");

main();
