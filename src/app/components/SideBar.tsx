import PlayerForm from "@/app/components/PlayerForm";
import React from "react";
import ConnectionBox from "@/app/components/ConnectionBox";
import Arrow from "@/app/components/Arrow";
import { PlayerNode, TeamNode } from "@/app/classes/Nodes";
import Scrollbar from "./Scrollbar";

function PlayerPath({ activePath }: { activePath: [PlayerNode, TeamNode][] }) {
    if (activePath.length === 0) {
        return null;
    }

    const lastTeam = activePath[activePath.length - 1][1];

    return (
        <Scrollbar className="my-2 self-start pr-4 mr-1">
                {activePath.slice(0, -1).map(([player, team]) => (
                    <ConnectionBox
                        key={player.id}
                        playerName={player.name}
                        playerId={player.id}
                        teamName={team.team_name}
                        teamSeason={team.season}
                    />
                ))}
                {activePath.length > 0 && (
                    <ConnectionBox
                        teamName={lastTeam.team_name}
                        teamSeason={lastTeam.season}
                    />
                )}
        </Scrollbar>
    );
}

interface Props {
    onSearch: (playerName: string) => void;
    onFind: (playerName: string) => void;
    activePath: [PlayerNode, TeamNode][];
    playerName: string;
    loading: boolean;
}

export default function SideBar({
    onSearch,
    onFind,
    activePath,
    playerName,
    loading,
}: Props) {
    return (
        <div className="flex h-full w-1/3 flex-col justify-center overflow-visible py-4 pl-10">
            <PlayerForm
                placeholder={"Player Name"}
                onSubmit={onSearch}
                defaultValue={playerName}
                className="text-4xl xl:text-5xl"
            />
            {loading && (
                <hr
                    className="animated-gradient mt-1 h-1 rounded-md border-none bg-gradient-to-r
                        from-purple-700 to-orange-600"
                ></hr>
            )}
            {activePath.length > 0 || <Arrow />}
            {activePath.length > 0 && <PlayerPath activePath={activePath} />}
            <PlayerForm
                placeholder={"Find Connection"}
                onSubmit={onFind}
                className="text-4xl xl:text-5xl"
                autoCompleteAbove={activePath.length > 0}
            />
        </div>
    );
}
