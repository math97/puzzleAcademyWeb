import { useEffect, useState } from "react";
import { ChampionService } from "../services/champion.service";
import { Container } from "../core-components/Container";
import { Text as Typography } from "@/core-components/Text";
import { PlayerCard } from "./PlayerCard";
import type { Player, PlayerResponseItem } from "../models/Player";
import { fetchPlayers } from "@/services/api";

type QueueType = 'SOLO' | 'FLEX';
type SortType = 'RANK' | 'LEVEL';
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
            const latestSnapshot = snapshots.length > 0
                ? [...snapshots].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
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
                pdlChange: stats.pointsLostOrWon,
                mainChampions: [], // Deprecated in favor of championMasteries
                championMasteries: masteries,
                totalPoints: totalPoints
            };
        });

        // Sort players
        mappedPlayers.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'RANK') {
                comparison = (b.totalPoints || 0) - (a.totalPoints || 0);
            } else {
                comparison = (b.summonerLevel || 0) - (a.summonerLevel || 0);
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

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                    {/* Queue Toggle (Left) */}
                    <div className="inline-flex bg-background/50 border border-white/10 p-1 rounded-lg backdrop-blur-sm order-2 sm:order-1">
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
                    <div className="flex items-center gap-2 bg-background/50 border border-white/10 p-1 rounded-lg backdrop-blur-sm order-1 sm:order-2">
                        <button
                            onClick={() => {
                                if (sortBy === 'RANK') {
                                    setSortDirection(prev => prev === 'DESC' ? 'ASC' : 'DESC');
                                } else {
                                    setSortBy('RANK');
                                    setSortDirection('DESC');
                                }
                            }}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${sortBy === 'RANK'
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Rank
                            {sortBy === 'RANK' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>
                        <div className="w-px h-4 bg-white/10" />
                        <button
                            onClick={() => {
                                if (sortBy === 'LEVEL') {
                                    setSortDirection(prev => prev === 'DESC' ? 'ASC' : 'DESC');
                                } else {
                                    setSortBy('LEVEL');
                                    setSortDirection('DESC');
                                }
                            }}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${sortBy === 'LEVEL'
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Level
                            {sortBy === 'LEVEL' && (
                                <span className="text-xs">{sortDirection === 'DESC' ? '▼' : '▲'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {displayedPlayers.map((player) => (
                    <PlayerCard key={player.id} {...player} />
                ))}
            </div>
        </Container>
    );
};
