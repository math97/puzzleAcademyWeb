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

// UI Model (Flattened for easier usage in components)
export interface Player {
    id: string; // From PlayerData.id
    rankPosition: number; // Calculated index + 1
    name: string; // gameName
    tagline: string; // tagLine
    tier: string; // From latest snapshot or player data
    rankLabel: string; // From latest snapshot (e.g. "IV")
    role: string; // Placeholder
    winrate: number; // Calculated from snapshot wins/losses
    pdl: number; // leaguePoints
    pdlChange: number; // pointsLostOrWon (from stats)
    mainChampions: string[]; // Placeholder
    totalPoints: number; // For sorting
}
