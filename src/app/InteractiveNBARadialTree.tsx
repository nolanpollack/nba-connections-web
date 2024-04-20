"use client";
import React, {FormEvent, useState} from "react";
import RadialTree from "@/app/components/RadialTree";
import {TeamNode, PlayerNode} from "@/app/classes/Nodes";
import TitleInput from "@/app/components/TitleInput";


function TeamInfo({popupPosition, popupData}: { popupPosition: { x: number, y: number }, popupData: TeamNode }) {
    return <div className={"absolute rounded-md bg-stone-200 p-4 border-black shadow-xl top-2 left-2 divide-y"}
                style={
                    {
                        top: popupPosition.y,
                        left: popupPosition.x
                    }

                }>
        <h1 className="text-xl">{popupData.season + " " + popupData.team_name}</h1>
        <h2>{}</h2>
        <ul>
            {popupData.players?.map((player) =>
                <li key={player.id}>
                    {/*<Image src={getHeadshotURL(player.id)} alt="headshot" width={52} height={38}/>*/}
                    {player.name}
                </li>)}
        </ul>
    </div>
}

export default function InteractiveNBARadialTree({dataNode}: { dataNode: PlayerNode }) {
    const data_wrapper= {"id": 0, "team_name": "root", "season": "root", "players": [dataNode]} as TeamNode;

    let playerMap: { [index: number]: { previousPlayer: PlayerNode, player: PlayerNode, through: TeamNode } } = {};
    let nameToPlayerID: { [index: string]: number } = {};

    // TODO: Use memo
    function createPaths(data: PlayerNode, previousNode: PlayerNode, through: TeamNode) {
        playerMap[data.id] = {previousPlayer: previousNode, player: data, through: through};
        nameToPlayerID[data.name] = data.id;

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

    const [activeTeams, setActiveTeams] = useState([] as TeamNode[]);

    const [popupOpen, setPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState({} as TeamNode);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});

    function handlePathHover(team: TeamNode, event: React.MouseEvent) {
        setPopupOpen(true);
        setPopupData(team);
        setPopupPosition({x: event.clientX, y: event.clientY});
    }

    function handlePopupClose() {
        setPopupOpen(false);
    }

    function onToSubmit(e: FormEvent<HTMLFormElement>) {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const playerName = formData.get("player");

        if (playerName) {
            const playerID = nameToPlayerID[playerName as string];
            if (!playerID) {
                console.log("Player not found: " + playerName);
                setActiveTeams([]);
                return;
            }

            let player = playerMap[playerID];
            const path = [[player.player, null] as [PlayerNode, TeamNode | null]];

            while (player.player != dataNode) {
                path.unshift([player.previousPlayer, player.through]);
                player = playerMap[player.previousPlayer.id];
            }

            const newActiveTeams = path.map(([_, team]) => team).filter((team) => team != null) as TeamNode[];

            setActiveTeams(newActiveTeams);
        } else {
            setActiveTeams([]);
        }
    }


    dataNode.teams?.sort((a, b) => a.season.localeCompare(b.season));


    return <div className="flex flex-col h-full w-full">
        <RadialTree data={data_wrapper} handlePathHover={handlePathHover} handlePopupClose={handlePopupClose}
                    activeTeams={activeTeams}/>
        <TitleInput placeholder={"Find Connection"} onSubmit={onToSubmit}/>

        {popupOpen && <TeamInfo popupPosition={popupPosition} popupData={popupData}/>}
    </div>
}


function getHeadshotURL(playerID: number) {
    return "https://cdn.nba.com/headshots/nba/latest/260x190/" + playerID + ".png";
}
