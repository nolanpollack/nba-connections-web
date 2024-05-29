import { HierarchyPointLink, HierarchyPointNode } from "d3";
import React, { useEffect, useMemo } from "react";
import { animated, useSpring } from "@react-spring/web";
import * as d3 from "d3";
import { TeamNode } from "@/app/classes/Nodes";

export default function Path({
    link,
    handlePathHover,
    handlePopupClose,
    activeTeams,
}: {
    link: HierarchyPointLink<TeamNode>;
    handlePathHover: (team: TeamNode, event: React.MouseEvent) => void;
    handlePopupClose: () => void;
    activeTeams: TeamNode[];
}) {
    const searching = activeTeams.length > 0;
    const active = activeTeams ? activeTeams.includes(link.target.data) : false;
    const strokeProperties = useMemo(
        () => ({
            strokeWidth: active ? 3 : 1,
            strokeOpacity: active ? 1 : .5,
        }),
        [active],
    );

    const [{ strokeWidth, strokeOpacity }, api] = useSpring(
        () => strokeProperties,
    );

    useEffect(() => {
        api.start(strokeProperties);
    }, [strokeProperties, api]);

    function onHover(event: React.MouseEvent<SVGPathElement, MouseEvent>) {
        api.start({
            strokeWidth: strokeProperties.strokeWidth * 1.75,
            strokeOpacity: 1,
        });
        handlePathHover(link.target.data, event);
    }

    function onMouseOut() {
        api.start(strokeProperties);
        handlePopupClose();
    }

    return (
        <animated.path
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            onMouseOver={onHover}
            onMouseOut={onMouseOut}
            className={
                !searching || active
                    ? teamColor(link.target.data.team_name)
                    : "stroke-stone-500"
            }
            d={
                d3
                    .linkRadial<
                        any,
                        HierarchyPointLink<TeamNode>,
                        HierarchyPointNode<TeamNode>
                    >()
                    .angle((d) => d.x)
                    .radius((d) => d.y)(link)!
            }
        ></animated.path>
    );
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
            return "slate-300";
    }
}
