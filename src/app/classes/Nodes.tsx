export interface PlayerNode {
    id: number;
    name: string;
    teams?: TeamNode[];
}

export interface TeamNode {
    id: number;
    team_name: string;
    season: string;
    players?: PlayerNode[];
}
