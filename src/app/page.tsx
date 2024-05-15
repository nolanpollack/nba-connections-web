"use client";
import InteractiveNBARadialTree from "@/app/components/InteractiveNBARadialTree";
import React, { FormEvent, useState } from "react";
import { PlayerNode } from "@/app/classes/Nodes";
import SearchPage from "@/app/components/SearchPage";
import players from "@/app/data/players.json";

async function fetchConnectionResponse(player: string) {
    const params = new URLSearchParams({ player });
    const url = "/api/find-connection?" + params;
    return await fetch(url);
}

export default function Home() {
    const [data, setData] = useState<PlayerNode>();
    const [loading, setLoading] = useState<boolean>(false);

    async function handlePlayerSearch(playerName: string) {
        if (loading) {
            return;
        }

        if (
            !playerName ||
            playerName.toLowerCase() == data?.name.toLowerCase()
        ) {
            return;
        }

        setLoading(true);

        setTimeout(async () => {
            try {
                const response = await fetchConnectionResponse(
                    playerName.toLowerCase(),
                );

                if (response.status === 200) {
                    const returnedData = (await response.json()) as PlayerNode;
                    console.log(returnedData);
                    setData(returnedData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }, 0);
    }

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
                ></SearchPage>
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
