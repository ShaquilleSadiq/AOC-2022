const fs = require("fs");
const path = require("path");

const max = {x: 0, y: 0, z: 0};
const space = [];
let water_points = [];
let surface_area = 0;

const main = async () => {
    const points = readFile("input.txt");
    const points_parsed = [];

    for (let point of points) {
        const [x, y, z] = point.split(",");
        space[x] = space[x] || [];
        space[x][y] = space[x][y] || [];
        space[x][y][z] = true;

        max.x = Math.max(...[x, max.x]);
        max.y = Math.max(...[y, max.y]);
        max.z = Math.max(...[z, max.z]);

        points_parsed.push([x, y, z]);
    }

    checkAllSides(points);
    console.log("P1: " + surface_area);


    fillWater(points_parsed);
    fillLava();
    checkAllSides(points);
    console.log("P2: " + surface_area);
};

const fillLava = () => {
    for (let i = 0; i < space.length; i++) {
        for (let j = 0; j < space[i]?.length; j++) {
            for (let k = 0; k < space[i][j]?.length; k++) {
                if (!space[i][j][k] && !pointInArr(water_points, [i,j,k])) space[i][j][k] = true;
            }
        }
    }
};

const fillWater = (points) => {
    const start_voxel = [0,0,0];
    const q = [];

    q.push(start_voxel);

    while(q.length > 0){
        const voxel = q.shift();

        if(pointInArr(water_points, voxel)) continue;
        water_points.push(voxel);

        for(let neighbour of neighbours(voxel)){
            if(!neighbour) continue;
            const [nx, ny, nz] = neighbour;

            if(nx >= 0 && nx <= max.x && ny >= 0 && ny <= max.y && nz >= 0 && nz <= max.z){
                if (!pointInArr(points, neighbour)) {
                    q.push(neighbour);
                }
            }
        }
    }
}

const pointInArr = (array, voxel) => array.some(r=> JSON.stringify(r.map((num) => parseInt(num))) === JSON.stringify(voxel))

const neighbours = (voxel) => {
    const [x, y, z] = voxel;
    
    return [
        x > 0 ? [x - 1, y, z] : null,
        [x + 1, y, z],
        y > 0 ? [x, y - 1, z] : null,
        [x, y + 1, z],
        z > 0 ? [x, y, z - 1] : null,
        [x, y, z + 1],
    ]
};

const checkAllSides = (points) => {
    surface_area = 0;

    for (let point of points) {
        const [x, y, z] = Array.isArray(point) ? point : point.split(",").map((num) => parseInt(num));

        checkX([x, y, z]);
        checkY([x, y, z]);
        checkZ([x, y, z]);
    }
};

const check = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;

    if (!(space[x] && space[x][y] && space[x][y][z])) {
        ignore_area || surface_area++;
        return 0;
    }

    return 1;
};

const checkX = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;
    
    let contact_area = 0;
    contact_area += check([x + 1, y, z], ignore_area);
    contact_area += check([x - 1, y, z], ignore_area);
    return contact_area;
};

const checkY = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;
    
    let contact_area = 0;
    contact_area += check([x, y + 1, z], ignore_area);
    contact_area += check([x, y - 1, z], ignore_area);
    return contact_area;
};

const checkZ = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;

    let contact_area = 0;
    contact_area += check([x, y, z + 1], ignore_area);
    contact_area += check([x, y, z - 1], ignore_area);
    return contact_area;
};

const readFile = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8").split("\n");

main();
