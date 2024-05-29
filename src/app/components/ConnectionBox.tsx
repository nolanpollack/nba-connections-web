import Arrow from "@/app/components/Arrow";
import { getMainColor } from "nba-color";
import { getTeamAbbreviation } from "@/app/utils/getTeamAbbreviation";
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

    return (
        <>
            <div className="flex items-center">
                <Arrow />
                <h2
                    style={{
                        color: mainColor.hex,
                    }}
                    className="ml-2 text-lg font-bold brightness-150 drop-shadow-sm dark:brightness-200"
                >
                    {teamSeason + " " + teamName}
                </h2>
            </div>
            {playerName && (
                <div className="flex items-center justify-start overflow-hidden rounded-lg ">
                    {playerId && <PlayerHeadshot playerID={playerId} />}
                    <h2 className="text-xl font-bold text-stone-600 xl:text-3xl dark:text-stone-300">
                        {playerName}
                    </h2>
                </div>
            )}
        </>
    );
}
