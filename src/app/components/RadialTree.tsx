import * as d3 from "d3";
import React from "react";
import { TeamNode } from "@/app/classes/Nodes";
import Path from "@/app/components/Path";
import { HierarchyPointNode } from "d3";

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
    // Arbitrary, but defines the sizing of ther
    const radius = 500;

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

    function getHeight(node: HierarchyPointNode<TeamNode>) {
        return node.y * Math.cos(node.x);
    }

    function getWidth(node: HierarchyPointNode<TeamNode>) {
        return node.y * Math.sin(node.x);
    }

    const maxHeight = root
        .descendants()
        .map(getHeight)
        .reduce((a, b) => Math.max(a, b));
    const maxWidth = root
        .descendants()
        .map(getWidth)
        .reduce((a, b) => Math.max(a, b));
    const minHeight = root
        .descendants()
        .map(getHeight)
        .reduce((a, b) => Math.min(a, b));
    const minWidth = root
        .descendants()
        .map(getWidth)
        .reduce((a, b) => Math.min(a, b));

    console.log(
        `minHeight: ${minHeight} minWidth: ${minWidth} maxHeight: ${maxHeight} maxWidth: ${maxWidth}`,
    );

    return (
        <svg
            viewBox={`${minWidth} ${-maxHeight} ${maxWidth - minWidth} ${maxHeight - minHeight}`}
            className="text-md flex-grow touch-none py-10 pr-10"
        >
            <g fill="none" stroke="#555" strokeOpacity={0.3} strokeWidth={1}>
                {root.links().map((link, i) => (
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
                {root.descendants().map((node, i) => (
                    <circle
                        key={i}
                        r={1}
                        className={`fill-stone-400 height:${getHeight(node)} radians:${node.x}`}
                        id={node.data.team_name}
                        transform={`rotate(${(node.x * 180) / Math.PI - 90}) translate(${node.y},0)`}
                    ></circle>
                ))}
            </g>
        </svg>
    );
}
