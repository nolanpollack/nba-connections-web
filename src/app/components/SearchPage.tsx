import TitleInput from "@/app/components/TitleInput";
import React from "react";
import Image from "next/image";
import basketball from "@/assets/basketball.svg";
import LoadingWheel from "@/app/components/LoadingWheel";

interface Props {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
}

export default function SearchPage({ onSubmit, loading }: Props) {
    return (
        <div className="flex flex-col items-center">
            {!loading && (
                <TitleInput
                    placeholder={"LeBron James"}
                    onSubmit={onSubmit}
                    required={true}
                    centered={true}
                    className="text-5xl lg:text-7xl"
                    label={"Player Name"}
                />
            )}
            {loading && <LoadingWheel />}
        </div>
    );
}
