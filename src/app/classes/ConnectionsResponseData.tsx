export default class ConnectionsResponseData {
    player: string;
    team: string;
    year: string;
    constructor(player: string, team: string, year: string) {
        this.player = player;
        this.team = team;
        this.year = year;
    }
}
