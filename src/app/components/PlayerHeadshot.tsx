import Image, { StaticImageData } from "next/image";
import getHeadshotURL from "@/app/utils/getHeadshotURL";
import { useState } from "react";
import fallback from "@/assets/fallback.png";

export default function PlayerHeadshot({ playerID }: { playerID: number }) {
    const imageScale = 0.5;

    const [src, setSrc] = useState(
        getHeadshotURL(playerID) as string | StaticImageData,
    );

    function changeSrc() {
        setSrc(fallback);
    }

    return (
        <Image
            src={src}
            alt="headshot"
            width={260 * imageScale}
            height={190 * imageScale}
            onError={changeSrc}
        />
    );
}
