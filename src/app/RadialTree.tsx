"use client";
import * as d3 from "d3";
import data from "./paths_teams_lebron.json";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

const RadialTree: React.FC<Props> = ({data}: Props) => {
    const width = 1000;
    const height = width;
    const cx = width * 0.5; // adjust as needed to fit
    const cy = height * 0.5; // adjust as needed to fit
    const radius = Math.min(width, height) / 2;

    function handleZoom(e: any) {
        d3.select("g").attr("transform", e.transform);
    }

    const zoom = d3.zoom().on("zoom", handleZoom);

    const tree = d3.tree<TeamNode>()
        .size([5 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));

    // Sort the tree and apply the layout.
    const root = tree(d3.hierarchy(data, d => d.players?.map(p => p.teams ?? []).flat())
        .sort((a, b) => d3.ascending(a.data.team_name, b.data.team_name)));


    return <svg viewBox={`${-cx} ${-cy} ${width} ${height}`} className="text-md h-full w-auto border-2">
        <g fill="none" stroke="#555" strokeOpacity={.3} strokeWidth={1.5}>
            {root.links().map((link, i) => (
                <path
                    key={i}
                    className={teamColor(link.target.data.team_name)}
                    // className="stroke-slate-300"
                    d={d3.linkRadial()
                        .angle(d=>d.x)
                        .radius(d=> d.y)(link)}></path>
            ))}
        </g>
                <g>
                    {root.descendants().map((node, i) => (
                        <circle key={i} r={1} className="fill-slate-300" id={node.data.team_name}
                                transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}></circle>
                    ))}
                </g>
    </svg>
}


export default function DataVisual() {
    const data_node = data as PlayerNode;
    const data_wrapper = {"id": 0, "team_name": "root", "season": "root", "players": [data_node]} as TeamNode;

    return <TransformWrapper>
            <TransformComponent>
                <RadialTree data={data_wrapper}/>
            </TransformComponent>
    </TransformWrapper>
        // <RadialTree data={data_wrapper}/>
}


