"use client";
import {useEffect, useRef, useState} from "react";

import * as d3 from "d3";
import data from "./paths_wemby.json";

interface Node {
    id: number;
    name: string;
    children?: Node[];
}

interface Props {
    data: Node;
}

const RadialTree: React.FC<Props> = ({data}: Props) => {
    const svgRef = useRef();
    const[svg, setSvg] = useState< d3.Selection<d3.BaseType, unknown, HTMLElement, any> | null>(null);

    const width = 1000;
    const height = width;
    const cx = width * 0.5; // adjust as needed to fit
    const cy = height * 0.59; // adjust as needed to fit
    const radius = Math.min(width, height) / 2 -30;

    const tree = d3.tree<Node>()
        .size([5 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));

    // Sort the tree and apply the layout.
    const root = tree(d3.hierarchy(data)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

    // useEffect(() => {
    //     // Specify the chart’s dimensions.
    //     const width = 1000;
    //     const height = width;
    //     const cx = width * 0.5; // adjust as needed to fit
    //     const cy = height * 0.59; // adjust as needed to fit
    //     const radius = Math.min(width, height) / 2 + 500;
    //
    //     // Create a radial tree layout.
    //     const tree = d3.tree<Node>()
    //         .size([5 * Math.PI, radius])
    //         .separation((a, b) => (a.parent == b.parent ? 1 : 2) / (a.depth ?? 1));
    //
    //     // Sort the tree and apply the layout.
    //     const root = tree(d3.hierarchy(data)
    //         .sort((a, b) => d3.ascending(a.data.name, b.data.name)));
    //
    //     // Create the SVG container.
    //     const svg = d3.select(svgRef.current!)
    //         .attr("width", width)
    //         .attr("height", height)
    //         .attr("viewBox", [-cx, -cy, width, height])
    //         .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

        // Append links.
        // svg.append("g")
        //     .attr("fill", "none")
        //     .attr("stroke", "#555")
        //     .attr("stroke-opacity", 0.4)
        //     .attr("stroke-width", 1.5)
        //     .selectAll()
        //     .data(root.links())
        //     .join("path")
            // .attr("d", d3.linkRadial<Node, d3.HierarchyPointNode<Node>>()
            //     .angle(d => d.x ?? 0)
            //     .radius(d => d.y ?? 0));

        // Append nodes.
        // svg.append("g")
        //     .selectAll()
        //     .data(root.descendants())
        //     .join("circle")
        //     .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        //     .attr("fill", d => d.children ? "#555" : "#999")
        //     .attr("r", 2.5);

        // Append labels.
        // svg.append("g")
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-width", 3)
        //     .selectAll()
        //     .data(root.descendants().filter(node => node.depth === 1))
        //     .join("text")
        //     .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
        //     .attr("dy", "0.31em")
        //     .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        //     .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        //     .attr("paint-order", "stroke")
        //     .attr("stroke", "white")
        //     .attr("fill", "currentColor")
        //     .text(d => d.data.name);

    //     setSvg(svg);
    // }, [data]);

    return <svg width={width} height={height} viewBox="-500 -500 1000 1000" className="text-md h-auto w-full">
        {/*<g>*/}
            {root.descendants().map((node, i) => (
                <circle r={2.5} className="fill-slate-300" key={i} transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}></circle>
            ))}
        {/*</g>*/}
    </svg>

    // return <svg ref={svgRef} />;
}

export default function DataVisual() {
    const data_node = data[0] as Node;

    return <RadialTree data={data_node} />
}


