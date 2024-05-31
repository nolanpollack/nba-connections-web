import React, { useState } from "react";
import RadialTree from "@/app/components/RadialTree";
import { PlayerNode, TeamNode } from "@/app/classes/Nodes";
import SideBar from "@/app/components/SideBar";

function TeamInfo({
    popupPosition,
    popupData,
}: {
    popupPosition: { x: number; y: number };
    popupData: TeamNode;
}) {
    let position: {right:number; bottom?:number; top?:number;} = {right: window.innerWidth - popupPosition.x}
    if (popupPosition.y > window.innerHeight / 2) {
        position.bottom= window.innerHeight - popupPosition.y;
    }
    else {
        position.top = popupPosition.y;
    }

    return (
        <div
            className={
                "absolute rounded-md dark:border bg-stone-200 p-4 shadow-xl dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            }
            style={position}
        >
            <h1 className="mb-2 border-b border-stone-400/50 pb-2 text-2xl font-semibold dark:border-stone-600">
                {popupData.season + " " + popupData.team_name}
            </h1>
            <ul className="text-lg">
                {popupData.players?.map((player) => (
                    <li className="pt-1" key={player.id}>
                        {player.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

interface Props {
    dataNode: PlayerNode;
    onSearch: (playerName: string) => Promise<void>;
    loading: boolean;
}

export default function InteractiveNBARadialTree({
    dataNode,
    onSearch,
    loading,
}: Props) {
    const data_wrapper = {
        id: 0,
        team_name: "root",
        season: "root",
        players: [dataNode],
    } as TeamNode;

    let playerMap: {
        [index: number]: {
            previousPlayer: PlayerNode;
            player: PlayerNode;
            through: TeamNode;
        };
    } = {};
    let nameToPlayerID: { [index: string]: number } = {};

    // TODO: Use memo
    function createPaths(
        data: PlayerNode,
        previousNode: PlayerNode,
        through: TeamNode,
    ) {
        playerMap[data.id] = {
            previousPlayer: previousNode,
            player: data,
            through: through,
        };
        nameToPlayerID[data.name.toLowerCase()] = data.id;

        if (data.teams) {
            data.teams.forEach((team) => {
                if (team.players) {
                    team.players.forEach((player) => {
                        createPaths(player, data, team);
                    });
                }
            });
        }
    }

    createPaths(dataNode, dataNode, data_wrapper);

    const [activePath, setActivePath] = useState(
        [] as [PlayerNode, TeamNode][],
    );

    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({} as TeamNode);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    function handlePathHover(team: TeamNode, event: React.MouseEvent) {
        setPopupOpen(true);
        setPopupData(team);
        setPopupPosition({ x: event.clientX, y: event.clientY });
    }

    function handlePopupClose() {
        setPopupOpen(false);
    }

    function handleFindConnection(playerName: string) {
        if (playerName) {
            const playerID = nameToPlayerID[playerName.toLowerCase()];
            if (!playerID) {
                console.log("Player not found: " + playerName);
                setActivePath([]);
                return;
            }

            let player = playerMap[playerID];

            const path = [] as [PlayerNode, TeamNode][];

            while (player.player != dataNode) {
                path.unshift([player.player, player.through]);
                player = playerMap[player.previousPlayer.id];
            }

            setActivePath(path);
        } else {
            setActivePath([]);
        }
    }

    // Should probably learn how promises work better to implement this
    function handleSearch(playerName: string) {
        onSearch(playerName).then((_) => {
            setActivePath([]);
        });
    }

    dataNode.teams?.sort((a, b) => a.season.localeCompare(b.season));

    return (
        <div className="relative flex h-full w-full ">
            <SideBar
                onFind={handleFindConnection}
                onSearch={handleSearch}
                activePath={activePath}
                playerName={dataNode.name}
                loading={loading}
            />
            <RadialTree
                data={data_wrapper}
                onPathHover={handlePathHover}
                onPopupClose={handlePopupClose}
                activeTeams={activePath.map(([_, team]) => team)}
            />
            {popupOpen && (
                <TeamInfo popupPosition={popupPosition} popupData={popupData} />
            )}
        </div>
    );
}
