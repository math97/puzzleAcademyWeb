export interface ArenaPlayerApiResponse {
    playerId: string;
    name: string;
    tagLine: string;
    profileIconId: number | null;
    totalGames: number;
    totalWins: number;
    totalTop4: number;
    avgPlacement: number;
    winRate: number;
    top4Rate: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    seasonKda: number;
    bestMatchKda: number;
    avgDamageToChampions: number;
    totalPentaKills: number;
    bestKillingSpree: number;
}

// UI model — flat and display-ready
export interface ArenaPlayer {
    playerId: string;
    rankPosition: number;
    name: string;
    tagLine: string;
    profileIconId: number | null;
    totalGames: number;
    avgPlacement: number;
    winRate: number;
    top4Rate: number;
    avgDamageToChampions: number;
    seasonKda: number;
    bestMatchKda: number;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalPentaKills: number;
    bestKillingSpree: number;
}

export type ArenaSortOption =
    | 'AVG_PLACEMENT'
    | 'WIN_RATE'
    | 'TOP4_RATE'
    | 'AVG_DAMAGE'
    | 'GAMES_PLAYED'
    | 'KDA'
    | 'BEST_KILLING_SPREE';
