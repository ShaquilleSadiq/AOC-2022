const fs = require("fs");
const path = require("path");

const main = async () => {
    const arr = readFile("input.txt");
    const stack_str = arr[0].split("\n");
    const instructs = arr[1].split("\n");
    const stack_arr = [];

    //parse stacks
    for (let i = 0; i < stack_str.length-1; i++) {
        line = stack_str[i];
        let chunks = line.match(/.{1,4}/g) || [];
        chunks = chunks.map((str) => {return str.trim()});

        for(let j = 0; j < chunks.length; j++){
            let chunk = chunks[j];

            if(chunk){
                stack_arr[j] = stack_arr[j] ?? [];
                stack_arr[j].unshift(chunk[1]);
            }
        }
    }
 
    const stack_arr1 = cloneArr(stack_arr);
    const stack_arr2 = cloneArr(stack_arr);

    //parse instructions
    for (const instruct of instructs) {
        let nums = instruct.match(/\d/g);
        
        let cnt = 0;
        let from = 0;
        let to = 0;

        if(nums.length === 4){
            cnt = parseInt(nums[0]+nums[1]);
            from = nums[2]-1;
            to = nums[3]-1;
        }
        else{
            cnt = parseInt(nums[0]);
            from = nums[1]-1;
            to = nums[2]-1;
        }

        p1(stack_arr1, cnt, from, to);
        p2(stack_arr2, cnt, from, to);
    }

    let str1 = '';
    let str2 = '';

    for (const stack1 of stack_arr1) str1 += stack1.pop();
    for (const stack2 of stack_arr2) str2 += stack2.pop();

    console.log("P1:", str1);
    console.log("P2:", str2);
};


const p1 = (stack_arr, cnt, from, to) => {
    for(let k = 0; k < cnt; k++) stack_arr[to].push(stack_arr[from].pop());
}

const p2 = (stack_arr, cnt, from, to) => {
    const len = stack_arr[from].length;
    stack_arr[to] = stack_arr[to].concat(stack_arr[from].splice(len-cnt, cnt));
}

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n\n");
const cloneArr = (arr) => JSON.parse(JSON.stringify(arr));

main();
