import { useEffect, useState } from "react";
import { Container } from "../core-components/Container";
import { Text as Typography } from "@/core-components/Text";
import { PlayerCard } from "./PlayerCard";
import type { Player, PlayerResponseItem } from "../models/Player";
import { fetchPlayers } from "@/services/api";

type QueueType = 'SOLO' | 'FLEX';

export const Leaderboard = () => {
    const [rawPlayers, setRawPlayers] = useState<PlayerResponseItem[]>([]);
    const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [queueType, setQueueType] = useState<QueueType>('SOLO');

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
            // Ideally if no snapshot for FLEX, they are unranked in FLEX.
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

            return {
                id: player.id,
                rankPosition: 0,
                name: player.gameName,
                tagline: player.tagLine,
                tier: tier ?? "UNRANKED",
                rankLabel: rankLabel ?? "",
                role: "Fill",
                winrate: winrate,
                pdl: leaguePoints,
                pdlChange: stats.pointsLostOrWon,
                mainChampions: ["Ahri", "Zed", "Yasuo"],
                totalPoints: totalPoints
            };
        });

        // Sort by totalPoints descending
        mappedPlayers.sort((a, b) => b.totalPoints - a.totalPoints);

        // Assign rank position
        const rankedPlayers = mappedPlayers.map((p, index) => ({
            ...p,
            rankPosition: index + 1
        }));

        setDisplayedPlayers(rankedPlayers);

    }, [rawPlayers, queueType]);

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

                {/* Queue Toggle */}
                <div className="inline-flex bg-background/50 border border-white/10 p-1 rounded-lg backdrop-blur-sm">
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
            </div>

            <div className="space-y-3">
                {displayedPlayers.map((player) => (
                    <PlayerCard key={player.id} {...player} />
                ))}
            </div>
        </Container>
    );
};
