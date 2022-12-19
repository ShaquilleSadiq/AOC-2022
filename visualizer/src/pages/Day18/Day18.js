import * as React from "react";
import { Box, FormGroup, FormControlLabel, Switch, Button, LinearProgress } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { ThemeContext } from "../../components/ThemeContext";
import { OrbitControls, Stats, Sky } from '@react-three/drei'
import { p1, p2, lava_voxels, water_voxels, init, max, p2_progress } from "./day-18";

const Box3D = (props) => {
    const options = props.options ?? {};
    const { theme } = React.useContext(ThemeContext);
    const mesh = React.useRef();

    const [hovered, setHover] = React.useState(false);
    const [active, setActive] = React.useState(false);

    const hoverColor = theme.palette.mode === "dark" ? "#ffffff" : "#400B0B";

    let color = options.color ? options.color : "#EE7B06";
    color = active ? "#A12424" : color;
    color = hovered ? hoverColor : color;

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 0.6 : 1}
            onClick={(event) => {
                event.stopPropagation()
                !options?.disableClick && setActive(!active);
            }}
            onPointerOver={(event) => {
                event.stopPropagation()
                !options?.disableHover && setHover(true)
            }}
            onPointerOut={(event) => {
                event.stopPropagation()
                !options?.disableHover && setHover(false)
            }}
        >
            <boxGeometry args={[1,1,1]}/>
            <meshPhysicalMaterial color={color} metalness={0.5} roughness={0.5} clearcoat={0.4} clearcoatRoughness={0.4} flatShading={true}/>
        </mesh>
    );
};

const createVoxels = (array, intersect_x = false, intersect_y = false, intersect_z = false, options) => {
    const list = [];
    options = options ? options : {
        disableClick: false,
        disableHover: false,
        color: false,
    };

    for(const [i, voxel] of Object.entries(array)){
        const [x, y, z] = voxel;

        const show_x = !intersect_x || (x < Math.floor(max.x / 2));
        const show_z = !intersect_y || (y < Math.floor(max.y / 2));
        const show_y = !intersect_z || (z < Math.floor(max.z / 2));

        if(show_x && show_y && show_z){
            list.push(<Box3D key={`voxel-${i}`} position={voxel} options={options}/>);            
        }
    }

    return list;
}

const Day18 = () => {
    const [lavaVoxels, setLavaVoxels] = React.useState([]);
    const [waterVoxels, setWaterVoxels] = React.useState([]);
    const [intersectX, setIntersectX] = React.useState(false);
    const [intersectY, setIntersectY] = React.useState(false);
    const [intersectZ, setIntersectZ] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const contRef = React.useRef();

    setInterval(() => {
        // console.log(lava_voxels);
        // setProgress(p2_progress);
    }, 100)

    React.useEffect(() => {
        init();
        p1();
        // p2();
        setLavaVoxels(lava_voxels);
        setWaterVoxels(water_voxels);
    }, []);

    const guiStyle = {
        backgroundColor: "#282828",
        borderRadius: "5%",
        color: "#fff",
        padding: "1rem",
        position: "absolute",
        top: "1rem",
        right: "1rem",
    }

    const renderWater = () => {
        p2();
        console.log(water_voxels);
        setLavaVoxels(lava_voxels);
        setWaterVoxels(water_voxels);
    }

    return (
        <Box ref={ contRef } sx={{ height: "100vh" }}>
            <Canvas camera={ { position: [max.x+5, max.y+5, max.z+5] } }>
                <ambientLight intensity={0.1} />
                <directionalLight position={[max.x+3, max.y+20, max.z+5]} />
                <axesHelper args={[max.z]}/>
                <Sky distance={450000} sunPosition={[50, 100, 100]} inclination={0} azimuth={0.25}/>
                {createVoxels(lavaVoxels, intersectX, intersectY, intersectZ)}
                {createVoxels(waterVoxels, intersectX, intersectY, intersectZ,{ disableClick: true, disableHover: true, color: "blue" })}
                <Stats/>
                <OrbitControls />
            </Canvas>
            <Box sx={guiStyle}>
            <FormGroup>
                <FormControlLabel control={<Switch checked={intersectX} onChange={(e) => setIntersectX(e.target.checked)} />} label="Split on X" />
                <FormControlLabel control={<Switch checked={intersectY} onChange={(e) => setIntersectY(e.target.checked)} />} label="Split on Y" />
                <FormControlLabel control={<Switch checked={intersectZ} onChange={(e) => setIntersectZ(e.target.checked)} />} label="Split on Z" />
                {/* <Button variant="outlined" onClick={renderWater}>Render Water</Button> */}
                {progress > 0 ? <LinearProgress variant="determinate" value={progress} sx={{paddingInline: "0.5rem"}}/> : undefined}
            </FormGroup>
            </Box>
        </Box>
    );
}

export default Day18;