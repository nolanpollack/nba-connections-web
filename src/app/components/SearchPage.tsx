import PlayerForm from "@/app/components/PlayerForm";
import React from "react";
import LoadingWheel from "@/app/components/LoadingWheel";

interface Props {
    onSubmit: (playerName: string) => void;
    loading: boolean;
}

export default function SearchPage({ onSubmit, loading }: Props) {
    return (
        <div className="flex flex-col">
            {!loading && (
                <PlayerForm
                    placeholder={"LeBron James"}
                    onSubmit={onSubmit}
                    required={true}
                    className="text-center text-5xl lg:text-7xl"
                    label={"Player Name"}
                />
            )}
            {loading && <LoadingWheel />}
        </div>
    );
}
