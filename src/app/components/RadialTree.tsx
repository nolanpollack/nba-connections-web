import * as d3 from "d3";
import React from "react";
import { TeamNode } from "@/app/classes/Nodes";
import Path from "@/app/components/Path";

interface Props {
    data: TeamNode;
    handlePathHover: (team: TeamNode, event: React.MouseEvent) => void;
    handlePopupClose: () => void;
    activeTeams: TeamNode[];
}

export default function RadialTree({
    data,
    handlePathHover,
    handlePopupClose,
    activeTeams,
}: Props) {
    const numLayers = 100;
    const width = 1000;
    const height = 1000;
    const cx = -width / 2;
    const cy = -height / 2;
    const radius = width / 2;

    const tree = d3
        .tree<TeamNode>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));

    // Sort the tree and apply the layout.
    const root = tree(
        d3
            .hierarchy(data, (d) => d.players?.map((p) => p.teams ?? []).flat())
            .sort((a, b) => d3.ascending(a.data.team_name, b.data.team_name)),
    );
    // log max depth of tree
    console.log(
        `max node.y: ${root
            .descendants()
            .map((node) => node.y)
            .reduce((a, b) => Math.max(a, b))}`,
    );

    const gCos = root
        .descendants()
        .map((node) => node.y * Math.cos((node.x * 180) / Math.PI - 90));
    const gSin = root
        .descendants()
        .map((node) => node.y * Math.sin((node.x * 180) / Math.PI - 90));
    const gTop = gCos.reduce((a, b) => Math.min(a, b));
    const gBottom = gCos.reduce((a, b) => Math.max(a, b));
    const gLeft = gSin.reduce((a, b) => Math.min(a, b));
    const gRight = gSin.reduce((a, b) => Math.max(a, b));

    const gHeight = gBottom - gTop;
    const gWidth = gRight - gLeft;

    console.log(
        `gTop: ${gTop}, gBottom: ${gBottom}, gLeft: ${gLeft}, gRight: ${gRight} gHeight: ${gHeight}, gWidth: ${gWidth}`,
    );

    return (
        <svg
            viewBox={`${cx} ${cy} ${width} ${height}`}
            className="text-md flex-grow touch-none p-2"
            height={window.innerHeight}
        >
            <g fill="none" stroke="#555" strokeOpacity={0.3} strokeWidth={1}>
                {root
                    .links()
                    .filter((link) => link.source.depth < numLayers)
                    .map((link, i) => (
                        <Path
                            key={i}
                            link={link}
                            handlePathHover={handlePathHover}
                            handlePopupClose={handlePopupClose}
                            activeTeams={activeTeams}
                        />
                    ))}
            </g>
            <g>
                {root
                    .descendants()
                    .filter((node) => node.depth < numLayers + 1)
                    .map((node, i) => (
                        <circle
                            key={i}
                            r={1}
                            className={`fill-stone-400 height:${node.y * Math.cos((node.x * 180) / Math.PI - 90)}`}
                            id={node.data.team_name}
                            transform={`rotate(${(node.x * 180) / Math.PI - 90}) translate(${node.y},0)`}
                        ></circle>
                    ))}
            </g>
            {/* <rect */}
            {/*     width={gWidth} */}
            {/*     height={gHeight} */}
            {/*     x={-500} */}
            {/*     y={-500} */}
            {/*     fill={"transparent"} */}
            {/*     className={"fill-transparent stroke-rose-500"} */}
            {/* /> */}
        </svg>
    );
}
