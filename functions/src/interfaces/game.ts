export interface Game {
    id: string;
    name: string;
    publisher?: string;
    releaseYear?: number;
    players: {
        min: number;
        max?: number;
    };
    type: string;
    expansions?: string[];
    baseGame?: string;
    standalone?: boolean;
}
