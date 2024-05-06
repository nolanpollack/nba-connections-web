export default function getHeadshotURL(playerID: number) {
    return (
        "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
        playerID +
        ".png"
    );
}
