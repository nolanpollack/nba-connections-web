import TitleInput from "@/app/components/TitleInput";
import React from "react";
import Image from "next/image";
import basketball from "@/assets/basketball.svg";

interface Props {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

export default function SearchPage({ onSubmit, loading }: Props) {
    return (
        <div className="flex flex-col items-center">
            <TitleInput
                placeholder={"Enter an NBA Player's Name"}
                onSubmit={onSubmit}
                required={true}
                centered={true}
                className="text-8xl"
                label={"NBA Player Name"}
            />
            {loading && (
                <Image
                    src={basketball}
                    alt="loading"
                    className="mt-10 w-20 animate-bounce stroke-amber-50"
                />
            )}
        </div>
    );
}
