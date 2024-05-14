import Arrow from "@/app/components/Arrow";
import { getColors, getMainColor, getSecondaryColor } from "nba-color";
import { getTeamAbbreviation } from "@/app/utils/getTeamAbbreviation";
import getHeadshotURL from "@/app/utils/getHeadshotURL";
import Image from "next/image";
import PlayerHeadshot from "@/app/components/PlayerHeadshot";

interface Props {
    playerName?: string;
    playerId?: number;
    teamName: string;
    teamSeason: string;
}

export default function ConnectionBox({
    playerName,
    playerId,
    teamName,
    teamSeason,
}: Props) {
    const abbr = getTeamAbbreviation(teamName);

    if (!abbr) {
        return null;
    }

    const mainColor = getMainColor(abbr);
    const secondaryColor = getSecondaryColor(abbr);

    return (
        <>
            <div className="flex items-center">
                <Arrow />
                <h2
                    style={{
                        color: mainColor.hex,
                    }}
                    className="box-shadow-lg ml-2 text-lg font-bold brightness-200"
                >
                    {teamSeason + " " + teamName}
                </h2>
            </div>
            {playerName && (
                <div className="flex items-center justify-start overflow-hidden rounded-lg ">
                    {playerId && <PlayerHeadshot playerID={playerId} />}
                    <h2 className="text-xl font-bold text-stone-300 xl:text-3xl">
                        {playerName}
                    </h2>
                </div>
            )}
        </>
    );
}
