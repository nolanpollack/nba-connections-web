import * as d3 from "d3";
import data from "./paths_teams_lebron.json";

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
    data: PlayerNode;
}

const RadialTree: React.FC<Props> = ({data}: Props) => {
    const width = 1000;
    const height = width;
    const cx = width * 0.5; // adjust as needed to fit
    const cy = height * 0.59; // adjust as needed to fit
    const radius = Math.min(width, height) / 2;

    const tree = d3.tree<PlayerNode>()
        .size([5 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));

    // Sort the tree and apply the layout.
    const root = tree(d3.hierarchy(data)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

    return <svg viewBox="-500 -500 1000 1000" className="text-md h-auto w-full">
        <g fill="none" stroke="#555" strokeOpacity={.4} strokeWidth={1.5}>
            {root.links().map((link, i) => (
                <path
                    key={i}
                    className="stroke-slate-300"
                    d={d3.linkRadial()
                        .angle(d=>d.x)
                        .radius(d=> d.y)(link)}></path>
            ))}
        </g>
        <g>
            {root.descendants().map((node, i) => (
                <circle r={1} className="fill-slate-300" key={i}
                        transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}></circle>
            ))}
        </g>
    </svg>
}

export default function DataVisual() {
    const data_node = data as PlayerNode;

    return <RadialTree data={data_node}/>
}


