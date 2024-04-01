"use client";
import * as d3 from "d3";
import {HierarchyPointLink, HierarchyPointNode} from "d3";
import data from "./paths_teams_lebron.json";
import {animated, useSpring} from "@react-spring/web";
import {useGesture} from "@use-gesture/react";
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

const RadialTree = ({data}: Props) => {
    const width = 1000;
    const height = 1000;
    const cx = width * 0.5; // adjust as needed to fit
    const cy = width * 0.5;
    const radius = Math.min(width, width) / 2;

    // const [props, api] = useSpring(() => ({x: 0, y: 0}));
    const [{viewBox, scale}, api] = useSpring(() => ({viewBox: `${-cx} ${-cy} ${width} ${height}`, scale: 1}));

    const bind = useGesture(
        {
            onDrag: ({down, offset: [ox, oy]}) => {
                api.start({viewBox: `${-cx - ox} ${-cy - oy} ${width} ${height}`, immediate: down})
                // api.start({x: ox, y: oy, immediate: down});
            },
            onPinch: ({offset: [scale, angle]}) => {
                // setScale(scale);
                api.start({scale: scale, immediate: true});
                // api.start({viewBox: `${-cx} ${-cy} ${width} ${width}`, immediate: true});
            }
        },
        {
            drag: {
                // bounds: {left: -100, right: 100, top: -100, bottom: 100},
            }
        });


    const tree = d3.tree<TeamNode>()
        .size([5 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));

    // Sort the tree and apply the layout.
    const root = tree(d3.hierarchy(data, d => d.players?.map(p => p.teams ?? []).flat())
        .sort((a, b) => d3.ascending(a.data.team_name, b.data.team_name)));

    return <animated.svg viewBox={viewBox} {...bind()}
                         className="text-md h-full w-auto border-2 touch-none rounded-md">
        <g fill="none" stroke="#555" strokeOpacity={.3}>
            {root.links().map((link, i) => (
                <animated.path
                    onMouseOver = {() => console.log("hover")}
                    key={i}
                    strokeWidth={scale}
                    className={teamColor(link.target.data.team_name)}
                    d={scale.to(s => d3.linkRadial<any, HierarchyPointLink<TeamNode>, HierarchyPointNode<TeamNode>>()
                        .angle((d) => d.x)
                        .radius(d => d.y * s)(link)!)}></animated.path>
            ))}
        </g>
        <g>
            {root.descendants().map((node, i) => (
                <animated.circle key={i} r={scale} className="fill-slate-300" id={node.data.team_name}
                        transform={scale.to( s =>`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y * s},0)`)}></animated.circle>
            ))}
        </g>
    </animated.svg>
}


export default function DataVisual() {
    const data_node = data as PlayerNode;
    const data_wrapper = {"id": 0, "team_name": "root", "season": "root", "players": [data_node]} as TeamNode;

    return <RadialTree data={data_wrapper}/>
}


