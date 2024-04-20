"use client";
import * as d3 from "d3";
import {HierarchyPointLink, HierarchyPointNode} from "d3";
import data from "./paths_teams_lebron.json";
import {animated, to, useSpring} from "@react-spring/web";
import {Zoom} from '@visx/zoom';
import {TransformMatrix} from "@visx/zoom/lib/types";
import React, {useState} from "react";
import Image from "next/image";

interface PlayerNode {
    id: number;
    name: string;
    teams?: TeamNode[];
}

interface TeamNode {
    id: number;
    team_name: string;
    season: string;
    players?: PlayerNode[];
}

interface Props {
    data: TeamNode;
    handlePathHover: (team: TeamNode, event: React.MouseEvent) => void;
    handlePopupClose: () => void;
}

function Path({link, handlePathHover, handlePopupClose}: {
    link: HierarchyPointLink<TeamNode>,
    handlePathHover: (team: TeamNode, event: React.MouseEvent) => void,
    handlePopupClose: () => void
}) {
    const [{strokeWidth, strokeOpacity}, api] = useSpring(() => ({strokeWidth: 1, strokeOpacity: .3}));

    function onHover(event: React.MouseEvent<SVGPathElement, MouseEvent>) {
        api.start({strokeWidth: 1.75, strokeOpacity: 1});
        handlePathHover(link.target.data, event);
    }

    function onMouseOut() {
        api.start({strokeWidth: 1, strokeOpacity: .3});
        handlePopupClose();
    }

    return <animated.path
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        onMouseOver={onHover}
        onMouseOut={onMouseOut}
        className={teamColor(link.target.data.team_name)}
        d={d3.linkRadial<any, HierarchyPointLink<TeamNode>, HierarchyPointNode<TeamNode>>()
            .angle((d) => d.x)
            .radius(d => d.y)(link)!}>
    </animated.path>
}

function teamColor(team: string) {
    switch (team) {
        case "Atlanta Hawks":
            return "stroke-red-500";
        case "Boston Celtics":
            return "stroke-green-500";
        case "Brooklyn Nets":
            return "stroke-blue-500";
        case "Charlotte Hornets":
            return "stroke-yellow-500";
        case "Chicago Bulls":
            return "stroke-red-600";
        case "Cleveland Cavaliers":
            return "stroke-yellow-400";
        case "Dallas Mavericks":
            return "stroke-blue-400";
        case "Denver Nuggets":
            return "stroke-yellow-400";
        case "Detroit Pistons":
            return "stroke-blue-600";
        case "Golden State Warriors":
            return "stroke-yellow-600";
        case "Houston Rockets":
            return "stroke-red-400";
        case "Indiana Pacers":
            return "stroke-yellow-500";
        case "Los Angeles Clippers":
            return "stroke-blue-700";
        case "Los Angeles Lakers":
            return "stroke-purple-400";
        case "Memphis Grizzlies":
            return "stroke-blue-300";
        case "Miami Heat":
            return "stroke-red-400";
        case "Milwaukee Bucks":
            return "stroke-green-400";
        case "Minnesota Timberwolves":
            return "stroke-blue-500";
        case "New Orleans Pelicans":
            return "stroke-yellow-600";
        case "New York Knicks":
            return "stroke-blue-400";
        case "Oklahoma City Thunder":
            return "stroke-blue-500";
        case "Orlando Magic":
            return "stroke-blue-500";
        case "Philadelphia 76ers":
            return "stroke-blue-500";
        case "Phoenix Suns":
            return "stroke-purple-500";
        case "Portland Trail Blazers":
            return "stroke-red-500";
        case "Sacramento Kings":
            return "stroke-purple-500";
        case "San Antonio Spurs":
            return "stroke-gray-500";
        case "Toronto Raptors":
            return "stroke-red-600";
        case "Utah Jazz":
            return "stroke-yellow-500";
        case "Washington Wizards":
            return "stroke-blue-600";
        default:
            console.log("Unknown team: " + team);
            return "slate-300"
    }
}

function RadialTree({data, handlePathHover, handlePopupClose}: Props) {
    const numLayers = 10;
    const width = 1000;
    const height = 1000;
    const cx = 0;
    const cy = 0;
    const radius = Math.min(width, width) / 2;

    const tree = d3.tree<TeamNode>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));

    // Sort the tree and apply the layout.
    const root = tree(d3.hierarchy(data, d => d.players?.map(p => p.teams ?? []).flat())
        .sort((a, b) => d3.ascending(a.data.team_name, b.data.team_name)));

    const initialTransform = {
        scaleX: 1,
        scaleY: 1,
        translateX: width * .5,
        translateY: height * .5,
        skewX: 0,
        skewY: 0,
    }

    const [props, api] = useSpring(() => (initialTransform));

    function updateTransform(isDragging: boolean, transform: TransformMatrix) {
        const {scaleX, scaleY, translateX, translateY, skewX, skewY} = transform;
        api.start({translateX: translateX, translateY: translateY, immediate: isDragging});
        api.start({scaleX: scaleX, scaleY: scaleY});
        return props;
    }

    // return <Zoom<SVGSVGElement>
    //     width={width}
    //     height={height}
    //     scaleXMin={1}
    //     scaleXMax={8}
    //     scaleYMin={1}
    //     scaleYMax={8}
    //     initialTransformMatrix={initialTransform}>
    //     {(zoom) => (
            return <svg viewBox={`${cx} ${cy} ${width} ${height}`}
                 className="text-md flex-grow touch-none"
                 // ref={zoom.containerRef}
                 // onWheel={() => updateTransform(zoom.isDragging, zoom.transformMatrix)}
                 // onMouseDown={() => updateTransform(zoom.isDragging, zoom.transformMatrix)}
                 // onMouseMove={() => updateTransform(zoom.isDragging, zoom.transformMatrix)}
            >
                <animated.g style={
                    {
                        transform: to(
                            [props.scaleX, props.scaleY, props.translateX, props.translateY, props.skewX, props.skewY],
                            (scaleX, scaleY, translateX, translateY, skewX, skewY) => {
                                return `matrix(${scaleX}, 0, 0, ${scaleY}, ${translateX}, ${translateY}) skew(${skewX}, ${skewY})`
                            })
                    }
                }>
                    <g fill="none" stroke="#555" strokeOpacity={.3} strokeWidth={1}>
                        {root.links().filter((link) => link.source.depth < numLayers).map((link, i) => (
                            <Path key={i} link={link} handlePathHover={handlePathHover}
                                  handlePopupClose={handlePopupClose}/>
                        ))}
                    </g>
                    <g>
                        {root.descendants().filter((node) => node.depth < numLayers + 1).map((node, i) => (
                            <circle key={i} r={1} className={"fill-stone-400"} id={node.data.team_name}
                                    transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}></circle>
                        ))}
                    </g>
                </animated.g>
            </svg>
    //     )}
    // </Zoom>
}

function CanvasRadialTree({data, handlePathHover, handlePopupClose}: Props) {
    // Create canvas version of the svg
    // const numLayers = 10;
    const width = 1000;
    const height = 1000;
    const radius = Math.min(width, width) / 2;

    const tree = d3.tree<TeamNode>()
        .size([5 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));

    // Sort the tree and apply the layout.
    const root = tree(d3.hierarchy(data, d => d.players?.map(p => p.teams ?? []).flat())
        .sort((a, b) => d3.ascending(a.data.team_name, b.data.team_name)));

    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    function polarToCartesian(distance: number, angle: number) {
        const x = width / 2 + distance * Math.cos(angle);
        const y = height / 2 + distance * Math.sin(angle);
        return {x: x, y: y};
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (context) {
            context.clearRect(0, 0, width, height);
            root.descendants().forEach((node) => {
                const {x, y} = polarToCartesian(node.y, node.x);
                context.beginPath();
                context.arc(x, y, 1, 0, 2 * Math.PI);
                context.fillStyle = "white";
                context.fill();
            })
            root.links().forEach((link) => {
                const source = polarToCartesian(link.source.y, link.source.x);
                const target = polarToCartesian(link.target.y, link.target.x);
                context.beginPath();
                context.moveTo(source.x, source.y);
                context.lineTo(target.x, target.y);
                context.strokeStyle = teamColor(link.target.data.team_name);
                context.lineWidth = 1;
                context.stroke();
            })
        }
    }, [root]);

    return <canvas ref={canvasRef} width={width} height={height}
                   className="text-md border-2 touch-none rounded-md"></canvas>;
}

function getHeadshotURL(playerID: number) {
    return "https://cdn.nba.com/headshots/nba/latest/260x190/" + playerID + ".png";
}

function TeamInfo({popupPosition, popupData}: { popupPosition: { x: number, y: number }, popupData: TeamNode }) {
    return <div className={"absolute rounded-md bg-stone-200 p-4 border-black shadow-xl top-2 left-2 divide-y"}
                style={
                    {
                        top: popupPosition.y,
                        left: popupPosition.x
                    }

                }>
        <h1 className="text-xl">{popupData.season + " " + popupData.team_name}</h1>
        <h2>{}</h2>
        <ul>
            {popupData.players?.map((player) =>
                <li key={player.id}>
                    {/*<Image src={getHeadshotURL(player.id)} alt="headshot" width={52} height={38}/>*/}
                    {player.name}
                </li>)}
        </ul>
    </div>
}

function Title({data_node}: {data_node: PlayerNode}) {
    return <div className="flex justify-center items-center">
        {/*<Image src={getHeadshotURL(data_node.id)} alt="headshot" width={260} height={190}/>*/}
        <form className="flex justify-center py-4 my-4" onSubmit={(e) => e.preventDefault()}>
                <input
                    className="w-full text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-600 text-5xl sm:text-6xl lg:text-8xl caret-stone-200 focus:outline-none"
                    type={"text"} placeholder={"playuh"} maxLength={24}/>

        </form>
        {/*<h1*/}
        {/*    className="py-4 my-4 text-center font-extrabold">*/}
        {/*    <span*/}
        {/*        className="bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-8xl">*/}
        {/*        {data_node.name}*/}
        {/*    </span>*/}
        {/*</h1>*/}
    </div>
}


export default function DataVisual() {
    const data_node = data as PlayerNode;
    const data_wrapper = {"id": 0, "team_name": "root", "season": "root", "players": [data_node]} as TeamNode;

    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({} as TeamNode);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});

    function handlePathHover(team: TeamNode, event: React.MouseEvent) {
        setPopupOpen(true);
        setPopupData(team);
        setPopupPosition({x: event.clientX, y: event.clientY});
    }

    function handlePopupClose() {
        setPopupOpen(false);
    }

    data_node.teams?.sort((a, b) => a.season.localeCompare(b.season));


    return <div className="flex flex-col h-full w-full">
        <Title data_node={data_node}/>
        <RadialTree data={data_wrapper} handlePathHover={handlePathHover} handlePopupClose={handlePopupClose}/>
        {/*<div className="flex justify-center h-full">*/}
        {/*    <CanvasRadialTree data={data_wrapper} handlePathHover={handlePathHover}*/}
        {/*                      handlePopupClose={handlePopupClose}/>*/}
        {/*</div>*/}

        {popupOpen && <TeamInfo popupPosition={popupPosition} popupData={popupData}/>}
    </div>
}


