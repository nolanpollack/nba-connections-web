import TitleInput from "@/app/components/TitleInput";
import React from "react";
import ConnectionBox from "@/app/ConnectionBox";
import Arrow from "@/app/components/Arrow";
import { PlayerNode, TeamNode } from "@/app/classes/Nodes";

interface Props {
    onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    onFind: (e: React.FormEvent<HTMLFormElement>) => void;
    activePath: [PlayerNode, TeamNode][];
    playerName: string;
}

function PlayerPath({ activePath }: { activePath: [PlayerNode, TeamNode][] }) {
    if (activePath.length === 0) {
        return null;
    }

    const lastTeam = activePath[activePath.length - 1][1];

    return (
        <div
            className="mr-4 overflow-auto pr-10 scrollbar scrollbar-thumb-stone-700
        scrollbar-thumb-rounded-xl scrollbar-w-1 hover:scrollbar-thumb-stone-600 active:scrollbar-thumb-stone-500"
        >
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
        </div>
    );
}

export default function SideBar({
    onSearch,
    onFind,
    activePath,
    playerName,
}: Props) {
    return (
        <div className="flex h-full flex-col justify-center py-4 pl-10">
            <TitleInput
                placeholder={"Player Name"}
                onSubmit={onSearch}
                value={playerName}
                className="text-4xl xl:text-5xl"
            />
            {activePath.length > 0 || <Arrow />}
            {activePath.length > 0 && PlayerPath({ activePath })}
            <TitleInput
                placeholder={"Find Connection"}
                onSubmit={onFind}
                className="text-4xl xl:text-5xl"
            />
        </div>
    );
}
