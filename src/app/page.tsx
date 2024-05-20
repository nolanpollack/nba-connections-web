"use client";
import InteractiveNBARadialTree from "@/app/components/InteractiveNBARadialTree";
import React, { useState } from "react";
import { PlayerNode } from "@/app/classes/Nodes";
import SearchPage from "@/app/components/SearchPage";
import players from "@/app/data/players.json";

async function fetchConnectionResponse(playerName: string) {
    try {
        const player = playerName.toLowerCase();
        const params = new URLSearchParams({ player });
        const url = "/api/find-connection?" + params;
        const response = await fetch(url);

        if (response.status === 200) {
            return (await response.json()) as PlayerNode;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

export default function Home() {
    const [data, setData] = useState<PlayerNode>();
    const [loading, setLoading] = useState<boolean>(false);

    async function handlePlayerSearch(playerName: string) {
        if (loading) {
            return;
        }

        // No need to search if the player name is empty or the same as the current player
        if (
            !playerName ||
            playerName.toLowerCase() == data?.name.toLowerCase()
        ) {
            return;
        }

        setLoading(true);
        const returnedData = await fetchConnectionResponse(playerName);
        if (!returnedData) {
            // TODO: Show error message
        } else {
            setData(returnedData);
        }
        setLoading(false);
    }

    // Set to remove duplicate player names
    const playerList = Array.from(
        new Set(
            players
                .map((player) => player[3])
                .filter(
                    (playerName) => typeof playerName === "string",
                ) as string[],
        ),
    );

    return (
        <main className="flex h-full items-center justify-center">
            {!data && (
                <SearchPage
                    onSubmit={handlePlayerSearch}
                    loading={loading}
                    playerList={playerList}
                />
            )}
            {data && (
                <InteractiveNBARadialTree
                    dataNode={data}
                    onSearch={handlePlayerSearch}
                    loading={loading}
                />
            )}
        </main>
    );
}
