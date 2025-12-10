export interface Player {
    rank: number;
    name: string;
    tagline: string;
    tier: string;
    role: string;
    winrate: number;
    lpChange: number;
    mainChampions?: string[];
}
