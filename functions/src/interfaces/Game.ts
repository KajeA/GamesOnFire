export interface Game {
    id?: string;
    name: string;
    releaseYear: number;
    publisher: string;
    [key: string]: any;
}
