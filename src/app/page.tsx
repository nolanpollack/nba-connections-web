"use client";
import InteractiveNBARadialTree from "@/app/InteractiveNBARadialTree";
import lebronData from "@/app/paths_teams_lebron.json";
import TitleInput from "@/app/components/TitleInput";
import React, {FormEvent, useState} from "react";
import ConnectionsResponseData from "@/app/classes/ConnectionsResponseData";
import {PlayerNode} from "@/app/classes/Nodes";
import basketball from "@/assets/basketball.svg";
import Image from "next/image";

export default function Home() {
    const [data, setData] = useState<PlayerNode>();
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        if (loading) {
            return;
        }

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const playerName = formData.get("player") as string | null;
        if (!playerName || playerName.toLowerCase() == data?.name.toLowerCase()) {
            return;
        }

        setLoading(true);
        // setData([])
        // setFirstPlayer(p1.toString());
        setTimeout(async () => {
            try {
                // const response = await fetchConnectionResponse(p1.toString(), p2.toString());
                //
                // if (response.status === 200) {
                //     const data = await response.json();
                //     const connections = data.map((item: any) => new ConnectionsResponseData(item[0], item[1], item[2]));
                //     setData(connections);
                // }
                setData(lebronData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // setLoading(false);
            }
        }, 1000);
    }

    return (
        <main className="flex items-center justify-center min-h-screen h-full flex-col">
            <TitleInput placeholder={"Player Name"} onSubmit={handleSubmit} required={true}/>
            {loading &&
                    <Image src={basketball} alt="loading" className="w-14"/>
                }
            {!loading && data && <InteractiveNBARadialTree dataNode={data}/>}
        </main>
    );
}
