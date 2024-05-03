import TitleInput from "@/app/components/TitleInput";
import React from "react";
import ConnectionBox from "@/app/ConnectionBox";
import Arrow from "@/app/components/Arrow";
import {TeamNode} from "@/app/classes/Nodes";

interface Props {
    onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    onFind: (e: React.FormEvent<HTMLFormElement>) => void;
    activeTeams: TeamNode[];
    playerName: string;
}

export default function SideBar({onSearch, onFind, activeTeams, playerName}: Props) {
    const lastTeam = activeTeams[activeTeams.length - 1];

    return <div className="py-4 flex flex-col items-center ">
        <TitleInput placeholder={"Player Name"} onSubmit={onSearch} value={playerName}/>
        {activeTeams.length > 0 || <Arrow/>}
        {/*TODO: Make own component probably*/}
        <div className="scrollbar overflow-auto">
            {activeTeams.slice(0, -1).map((team, index) => <ConnectionBox key={index} playerName={"Michael Jordan"}
                                                                          teamName={team.season + " " + team.team_name}/>)}
            {activeTeams.length > 0 && <ConnectionBox teamName={lastTeam.season + " " + lastTeam.team_name}/>}
        </div>
        <TitleInput placeholder={"Find Connection"} onSubmit={onFind}/>
    </div>
}