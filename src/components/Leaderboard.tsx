import { useEffect, useState } from "react";
import { ChampionService } from "../services/champion.service";
import { Container } from "../core-components/Container";
import { Text as Typography } from "@/core-components/Text";
import { PlayerCard } from "./PlayerCard";
import type { Player, PlayerResponseItem } from "../models/Player";
import { fetchPlayers } from "@/services/api";

type QueueType = 'SOLO' | 'FLEX';
type SortType = 'RANK' | 'WINRATE' | 'LEVEL' | 'SEASON_KILLS' | 'SEASON_DEATHS' | 'SEASON_ASSISTS' | 'SEASON_KDA' | 'BEST_KDA';
type SortDirection = 'ASC' | 'DESC';

export const Leaderboard = () => {
    const [rawPlayers, setRawPlayers] = useState<PlayerResponseItem[]>([]);
    const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [queueType, setQueueType] = useState<QueueType>('SOLO');
    const [sortBy, setSortBy] = useState<SortType>('RANK');
    const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchPlayers();
                setRawPlayers(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (rawPlayers.length === 0) return;

        const mappedPlayers: Player[] = rawPlayers.map((item) => {
            const { player } = item;

            // Select the stats based on queue type
            const queueData = queueType === 'SOLO' ? item.solo : item.flex;
            const { snapshots, stats } = queueData;

            // Get latest snapshot if available
            const rawSnapshotList = [...snapshots];
            const latestSnapshot = rawSnapshotList.length > 0
                ? [...rawSnapshotList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                : null;

            // If no snapshot for this queue, fallback to player base data (though base data might be stale/solo-only)
            const tier = latestSnapshot?.tier || (queueType === 'SOLO' ? player.tier : "UNRANKED");
            const rankLabel = latestSnapshot?.rank || (queueType === 'SOLO' ? player.rank : "");
            const leaguePoints = latestSnapshot?.leaguePoints ?? 0;
            const totalPoints = latestSnapshot?.totalPoints ?? 0;

            let winrate = 0;
            if (latestSnapshot) {
                const totalGames = latestSnapshot.wins + latestSnapshot.losses;
                if (totalGames > 0) {
                    winrate = Math.round((latestSnapshot.wins / totalGames) * 100);
                }
            }

            const masteries = player.championMasteries?.map(m => {
                const champ = ChampionService.getChampionById(m.championId);
                return {
                    championId: m.championId,
                    championLevel: m.championLevel,
                    championName: champ?.name,
                    championImage: champ ? ChampionService.getChampionImageUrl(champ.id) : undefined
                };
            }) || [];

            // Calculate Season KDA
            let seasonKda = 0;
            if (player.stats && player.stats.totalDeaths > 0) {
                seasonKda = Number(((player.stats.totalKills + player.stats.totalAssists) / player.stats.totalDeaths).toFixed(2));
            } else if (player.stats && (player.stats.totalKills > 0 || player.stats.totalAssists > 0)) {
                seasonKda = player.stats.totalKills + player.stats.totalAssists; // Perfect KDA logic
            }

            // Calculate PDL Change (Latest - Earliest)
            let pdlChangeValue = stats.pointsLostOrWon; // Default to backend value
            if (rawSnapshotList.length > 1) {
                // Ensure sorted by date ascending for this calc
                const sortedSnapshots = [...rawSnapshotList].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                const earliest = sortedSnapshots[0];
                const latest = sortedSnapshots[sortedSnapshots.length - 1];
                pdlChangeValue = latest.totalPoints - earliest.totalPoints;
            }

            return {
                id: player.id,
                rankPosition: 0, // This will be updated after sorting
                name: player.gameName,
                tagline: player.tagLine,
                summonerLevel: player.summonerLevel,
                tier: tier ?? "UNRANKED",
                rankLabel: rankLabel ?? "",
                role: "Fill", // Placeholder as not in API yet
                winrate: winrate,
                pdl: leaguePoints,
                pdlChange: pdlChangeValue,
                mainChampions: [], // Deprecated in favor of championMasteries
                championMasteries: masteries,
                totalPoints: totalPoints,
                stats: player.stats,
                seasonKda: seasonKda,
                bestMatchKda: player.stats?.bestMatchKda || 0
            };
        });

        // Sort players
        mappedPlayers.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'RANK') {
                comparison = (b.totalPoints || 0) - (a.totalPoints || 0);
            } else if (sortBy === 'WINRATE') {
                comparison = (b.winrate || 0) - (a.winrate || 0);
            } else if (sortBy === 'LEVEL') {
                comparison = (b.summonerLevel || 0) - (a.summonerLevel || 0);
            } else if (sortBy === 'SEASON_KILLS') {
                comparison = (b.stats?.totalKills || 0) - (a.stats?.totalKills || 0);
            } else if (sortBy === 'SEASON_DEATHS') {
                comparison = (b.stats?.totalDeaths || 0) - (a.stats?.totalDeaths || 0);
            } else if (sortBy === 'SEASON_ASSISTS') {
                comparison = (b.stats?.totalAssists || 0) - (a.stats?.totalAssists || 0);
            } else if (sortBy === 'SEASON_KDA') {
                comparison = (b.seasonKda || 0) - (a.seasonKda || 0);
            } else if (sortBy === 'BEST_KDA') {
                comparison = (b.bestMatchKda || 0) - (a.bestMatchKda || 0);
            }
            return sortDirection === 'DESC' ? comparison : -comparison;
        });

        // Assign rank position (always based on index after sort)
        const rankedPlayers = mappedPlayers.map((p, index) => ({
            ...p,
            rankPosition: index + 1
        }));

        setDisplayedPlayers(rankedPlayers);

    }, [rawPlayers, queueType, sortBy, sortDirection]);

    const handleSort = (type: SortType) => {
        if (sortBy === type) {
            setSortDirection(prev => prev === 'DESC' ? 'ASC' : 'DESC');
        } else {
            setSortBy(type);
            setSortDirection('DESC');
        }
    };

    const getSortButtonClass = (type: SortType) => {
        return `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${sortBy === type
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`;
    };

    if (loading) {
        return (
            <Container className="py-12 text-center">
                <Typography variant="h3" color="muted">Loading leaderboard...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-12 text-center">
                <Typography variant="h3" color="destructive">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container className="py-12">
            <div className="mb-8 text-center">
                <Typography as="h2" variant="h2" glow="cyan" className="mb-2">
                    THE LEADERBOARD
                </Typography>
                <Typography as="p" color="muted" className="mb-6">
                    Current standings of the Puzzle crew
                </Typography>

                <div className="flex flex-col xl:flex-row justify-between items-center gap-4 px-2">
                    {/* Queue Toggle (Left) */}
                    <div className="inline-flex bg-background/50 border border-white/10 p-1 rounded-lg backdrop-blur-sm order-2 xl:order-1">
                        <button
                            onClick={() => setQueueType('SOLO')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${queueType === 'SOLO'
                                ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Solo/Duo
                        </button>
                        <button
                            onClick={() => setQueueType('FLEX')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${queueType === 'FLEX'
                                ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Flex
                        </button>
                    </div>

                    {/* Sort Controls (Right) */}
                    <div className="flex items-center gap-1 order-1 xl:order-2 overflow-x-auto max-w-full no-scrollbar">
                        {/* Rank */}
                        <button
                            onClick={() => handleSort('RANK')}
                            className={getSortButtonClass('RANK')}
                        >
                            PDL
                            {sortBy === 'RANK' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>

                        <button
                            onClick={() => handleSort('WINRATE')}
                            className={getSortButtonClass('WINRATE')}
                        >
                            Winrate
                            {sortBy === 'WINRATE' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>

                        <button
                            onClick={() => handleSort('LEVEL')}
                            className={getSortButtonClass('LEVEL')}
                        >
                            Level
                            {sortBy === 'LEVEL' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>

                        <div className="w-px h-4 bg-white/10 mx-2" />

                        <button
                            onClick={() => handleSort('SEASON_KILLS')}
                            className={getSortButtonClass('SEASON_KILLS')}
                        >
                            Season Kills
                            {sortBy === 'SEASON_KILLS' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>

                        <button
                            onClick={() => handleSort('SEASON_DEATHS')}
                            className={getSortButtonClass('SEASON_DEATHS')}
                        >
                            Season Deaths
                            {sortBy === 'SEASON_DEATHS' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>

                        <button
                            onClick={() => handleSort('SEASON_ASSISTS')}
                            className={getSortButtonClass('SEASON_ASSISTS')}
                        >
                            Season Assists
                            {sortBy === 'SEASON_ASSISTS' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>

                        <button
                            onClick={() => handleSort('SEASON_KDA')}
                            className={getSortButtonClass('SEASON_KDA')}
                        >
                            Season KDA
                            {sortBy === 'SEASON_KDA' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>

                        <div className="w-px h-4 bg-white/10 mx-2" />

                        <button
                            onClick={() => handleSort('BEST_KDA')}
                            className={getSortButtonClass('BEST_KDA')}
                        >
                            Best Match KDA
                            {sortBy === 'BEST_KDA' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {displayedPlayers.map((player) => (
                    <PlayerCard
                        key={player.id}
                        {...player}
                        sortBy={sortBy}
                    />
                ))}
            </div>
        </Container>
    );
};
