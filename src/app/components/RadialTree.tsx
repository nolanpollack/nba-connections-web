import * as d3 from "d3";
import { animated, to, useSpring } from "@react-spring/web";
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
  const numLayers = 10;
  const width = 1000;
  const height = 1000;
  const cx = 0;
  const cy = 0;
  const radius = Math.min(width, width) / 2 + 50;

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

  const initialTransform = {
    scaleX: 1,
    scaleY: 1,
    translateX: width * 0.5,
    translateY: height * 0.5,
    skewX: 0,
    skewY: 0,
  };

  const [props, api] = useSpring(() => initialTransform);

  return (
    <svg
      viewBox={`${cx} ${cy} ${width} ${height}`}
      className="text-md flex-grow touch-none"
    >
      <animated.g
        style={{
          transform: to(
            [
              props.scaleX,
              props.scaleY,
              props.translateX,
              props.translateY,
              props.skewX,
              props.skewY,
            ],
            (scaleX, scaleY, translateX, translateY, skewX, skewY) => {
              return `matrix(${scaleX}, 0, 0, ${scaleY}, ${translateX}, ${translateY}) skew(${skewX}, ${skewY})`;
            },
          ),
        }}
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
                className={"fill-stone-400"}
                id={node.data.team_name}
                transform={`rotate(${(node.x * 180) / Math.PI - 90}) translate(${node.y},0)`}
              ></circle>
            ))}
        </g>
      </animated.g>
    </svg>
  );
}
