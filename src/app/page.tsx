"use client";
import InteractiveNBARadialTree from "@/app/InteractiveNBARadialTree";
import lebronData from "@/app/paths_teams_victor_wembanyama.json";
import TitleInput from "@/app/components/TitleInput";
import React, { FormEvent, useState } from "react";
import ConnectionsResponseData from "@/app/classes/ConnectionsResponseData";
import { PlayerNode } from "@/app/classes/Nodes";
import basketball from "@/assets/basketball.svg";
import Image from "next/image";
import SearchPage from "@/app/components/SearchPage";

async function fetchConnectionResponse(player: string) {
    const params = new URLSearchParams({ player });
    const url = "/api/find-connection?" + params;
    console.log(url);
    return await fetch(url);
}

export default function Home() {
    const [data, setData] = useState<PlayerNode>();
    const [loading, setLoading] = useState<boolean>(false);

    async function getPlayerData(e: FormEvent<HTMLFormElement>) {
        if (loading) {
            return;
        }

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const playerName = formData.get("player") as string | null;
        if (
            !playerName ||
            playerName.toLowerCase() == data?.name.toLowerCase()
        ) {
            return;
        }

        setLoading(true);
        // setData(undefined);
        // setFirstPlayer(p1.toString());
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
                // setData(lebronData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    }

    return (
        <main className="flex h-full items-center justify-center">
            {!data && (
                <SearchPage
                    onSubmit={getPlayerData}
                    loading={loading}
                ></SearchPage>
            )}
            {data && (
                <InteractiveNBARadialTree
                    dataNode={data}
                    handleSearch={getPlayerData}
                />
            )}
        </main>
    );
}
