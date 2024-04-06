"use client";
import * as d3 from "d3";
import {HierarchyPointLink, HierarchyPointNode} from "d3";
import data from "./paths_teams_victor_wembanyama.json";
import {animated, to, useSpring} from "@react-spring/web";
import {Zoom} from '@visx/zoom';
import {TransformMatrix} from "@visx/zoom/lib/types";
import {useState} from "react";

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
    handlePathHover: (team: TeamNode) => void;
    handlePopupClose: () => void;
}

function Path({link, handlePathHover, handlePopupClose}: {
    link: HierarchyPointLink<TeamNode>,
    handlePathHover: (team: TeamNode) => void,
    handlePopupClose: () => void
}) {
    const [{strokeWidth, strokeOpacity}, api] = useSpring(() => ({strokeWidth: 1, strokeOpacity: .3}));

    function onHover() {
        api.start({strokeWidth: 1.75, strokeOpacity: 1});
        handlePathHover(link.target.data);
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
        .size([5 * Math.PI, radius])
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

    return <Zoom<SVGSVGElement>
        width={width}
        height={height}
        scaleXMin={1}
        scaleXMax={8}
        scaleYMin={1}
        scaleYMax={8}
        initialTransformMatrix={initialTransform}>
        {(zoom) => (
            <svg viewBox={`${cx} ${cy} ${width} ${height}`}
                 className="text-md h-full w-auto border-2 touch-none rounded-md"
                 ref={zoom.containerRef}
                 onWheel={() => updateTransform(zoom.isDragging, zoom.transformMatrix)}
                 onMouseDown={() => updateTransform(zoom.isDragging, zoom.transformMatrix)}
                 onMouseMove={() => updateTransform(zoom.isDragging, zoom.transformMatrix)}
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
                            <circle key={i} r={1} className="fill-slate-300" id={node.data.team_name}
                                    transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}></circle>
                        ))}
                    </g>
                </animated.g>
            </svg>)}
    </Zoom>
}


export default function DataVisual() {
    const data_node = data as PlayerNode;
    const data_wrapper = {"id": 0, "team_name": "root", "season": "root", "players": [data_node]} as TeamNode;

    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({} as TeamNode);
    const [popupPosition, setPopupPosition] = useState([0, 0] as [number, number]);

    function handlePathHover(team: TeamNode) {
        setPopupOpen(true);
        setPopupData(team);
    }

    function handlePopupClose() {
        setPopupOpen(false);
    }

    return <div className="h-full w-auto">
        <h1
            className="bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent text-5xl font-extrabold">
            {data_node.name}</h1>
        <RadialTree data={data_wrapper} handlePathHover={handlePathHover} handlePopupClose={handlePopupClose}/>
        {popupOpen &&
            <div className={"absolute rounded-md bg-stone-200 p-4 border-black shadow-xl top-2 left-2 divide-y"}>
                <h1 className="text-xl">{popupData.season + " " + popupData.team_name}</h1>
                <ul>
                    {popupData.players?.map((player) => <li key={player.id}>{player.name}</li>)}
                </ul>
            </div>}
    </div>
}


