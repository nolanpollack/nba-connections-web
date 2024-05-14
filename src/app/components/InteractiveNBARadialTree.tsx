import React, { FormEvent, useState } from "react";
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
    return (
        <div
            className={
                "absolute left-2 top-2 divide-y rounded-md border-black bg-stone-300 p-4 shadow-xl"
            }
            style={{
                top: popupPosition.y,
                left: popupPosition.x,
            }}
        >
            <h1 className="text-xl">
                {popupData.season + " " + popupData.team_name}
            </h1>
            <ul>
                {popupData.players?.map((player) => (
                    <li key={player.id}>{player.name}</li>
                ))}
            </ul>
        </div>
    );
}

interface Props {
    dataNode: PlayerNode;
    onSearch: (e: FormEvent<HTMLFormElement>) => Promise<void>;
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

    function handleFindConnection(e: FormEvent<HTMLFormElement>) {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const playerName = formData.get("player") as string | null;

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
    function handleSearch(e: FormEvent<HTMLFormElement>) {
        onSearch(e).then((_) => {
            setActivePath([]);
        });
    }

    dataNode.teams?.sort((a, b) => a.season.localeCompare(b.season));

    return (
        <div className="flex h-full w-full justify-start">
            <SideBar
                onFind={handleFindConnection}
                onSearch={handleSearch}
                activePath={activePath}
                playerName={dataNode.name}
                loading={loading}
            />
            <RadialTree
                data={data_wrapper}
                handlePathHover={handlePathHover}
                handlePopupClose={handlePopupClose}
                activeTeams={activePath.map(([_, team]) => team)}
            />
            {popupOpen && (
                <TeamInfo popupPosition={popupPosition} popupData={popupData} />
            )}
        </div>
    );
}
