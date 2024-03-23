export default class ConnectionsResponseData {
    team: string;
    year: string;
    player: string;
    constructor(team: string, year: string, player: string) {
        this.team = team;
        this.year = year;
        this.player = player;
    }
}