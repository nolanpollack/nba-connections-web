import TitleInput from "@/app/components/TitleInput";
import React from "react";
import ConnectionBox from "@/app/ConnectionBox";
import Arrow from "@/app/components/Arrow";
import {TeamNode} from "@/app/classes/Nodes";
import Image from "next/image";

interface Props {
    onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    onFind: (e: React.FormEvent<HTMLFormElement>) => void;
    activeTeams: TeamNode[];
    playerName: string;
}

export default function SideBar({onSearch, onFind, activeTeams, playerName}: Props) {
    return <div className="scrollbar-thin scrollbar-thumb-sky-100 py-4 flex flex-col items-center overflow-auto">
        <TitleInput placeholder={"Player Name"} onSubmit={onSearch} value={playerName}/>
        {activeTeams.length > 0 || <Arrow/>}
        {activeTeams.map((team, index) => <ConnectionBox key={index} playerName={"Michael Jordan"}
                                                         teamName={team.season + " " + team.team_name}/>)}
        <TitleInput placeholder={"Find Connection"} onSubmit={onFind}/>
    </div>
}