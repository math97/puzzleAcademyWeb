// Domain Entites matching API response
export interface PlayerData {
    id: string;
    gameName: string;
    tagLine: string;
    puuid: string;
    tier: string;
    rank: string;
    leaguePoints: number | null;
    profileIconId: number;
    summonerLevel: number;
    championMasteries: {
        championId: number;
        championLevel: number;
    }[];
    stats?: {
        totalKills: number;
        totalDeaths: number;
        totalAssists: number;
        bestMatchKda: number;
    };
}

// UI Model (Flattened for easier usage in components)
export interface Player {
    id: string;
    rankPosition: number;
    name: string;
    tagline: string;
    tier: string;
    rankLabel: string;
    role: string;
    winrate: number;
    pdl: number;
    pdlChange: number;
    championMasteries?: {
        championId: number;
        championLevel: number;
        championName?: string;
        championImage?: string;
    }[];
    mainChampions: string[]; // Keep for backward compatibility or existing usage if needed, or deprecate
    totalPoints: number;
    summonerLevel?: number;
    stats?: {
        totalKills: number;
        totalDeaths: number;
        totalAssists: number;
        bestMatchKda: number;
    };
    seasonKda?: number;
    bestMatchKda?: number;
}
export interface Snapshot {
    id: string;
    playerId: string;
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    hotStreak: boolean;
    totalPoints: number;
    createdAt: string;
}

export interface PlayerStats {
    pointsLostOrWon: number;
}

export interface QueueStats {
    snapshots: Snapshot[];
    stats: PlayerStats;
}

export interface PlayerResponseItem {
    player: PlayerData;
    solo: QueueStats;
    flex: QueueStats;
}

export interface PlayersApiResponse {
    data: PlayerResponseItem[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}
