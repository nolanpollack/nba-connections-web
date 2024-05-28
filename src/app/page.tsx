"use client";
import InteractiveNBARadialTree from "@/app/components/InteractiveNBARadialTree";
import React, { useState } from "react";
import { PlayerNode } from "@/app/classes/Nodes";
import SearchPage from "./components/SearchPage";

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

    return (
        <main className="flex h-full items-center justify-center">
            {!data && (
                <SearchPage onSubmit={handlePlayerSearch} loading={loading} />
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
