import { useEffect, useState } from "react";
import { Container } from "../core-components/Container";
import { Text as Typography } from "@/core-components/Text";
import { PlayerCard } from "./PlayerCard";
import type { Player, PlayerResponseItem } from "../models/Player";
import { fetchPlayers } from "@/services/api";

export const Leaderboard = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchPlayers();

                // Map API response to UI model
                const mappedPlayers: Player[] = response.data
                    .map((item: PlayerResponseItem) => {
                        const { player, snapshots, stats } = item;
                        // Find latest SOLO snapshot or use player data default
                        // Sorting snapshots by createdAt desc to get latest? 
                        // The user said "latest snapshot" - assuming API returns snapshots. 
                        // Let's take the last one in the array or sort it if needed. 
                        // For safety, let's sort by date.
                        const latestSnapshot = snapshots.length > 0
                            ? snapshots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                            : null;

                        const tier = latestSnapshot?.tier || player.tier || "IRON";
                        const rankLabel = latestSnapshot?.rank || player.rank || "IV";
                        const leaguePoints = latestSnapshot?.leaguePoints ?? player.leaguePoints ?? 0;
                        const totalPoints = latestSnapshot?.totalPoints ?? 0;

                        // Calculate winrate from snapshot if available
                        let winrate = 0;
                        if (latestSnapshot) {
                            const totalGames = latestSnapshot.wins + latestSnapshot.losses;
                            if (totalGames > 0) {
                                winrate = Math.round((latestSnapshot.wins / totalGames) * 100);
                            }
                        }

                        return {
                            id: player.id,
                            rankPosition: 0, // Will set after sort
                            name: player.gameName,
                            tagline: player.tagLine,
                            tier: tier,
                            rankLabel: rankLabel,
                            role: "Fill", // Placeholder
                            winrate: winrate,
                            pdl: leaguePoints, // Using PDL terminology
                            pdlChange: stats.pointsLostOrWon,
                            mainChampions: ["Ahri", "Zed", "Yasuo"], // Placeholder
                            totalPoints: totalPoints
                        };
                    });

                // Sort by totalPoints descending
                mappedPlayers.sort((a, b) => b.totalPoints - a.totalPoints);

                // Assign rank position based on index
                const rankedPlayers = mappedPlayers.map((p, index) => ({
                    ...p,
                    rankPosition: index + 1
                }));

                setPlayers(rankedPlayers);
            } catch (err) {
                console.error(err);
                setError("Failed to load leaderboard");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

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
            <div className="mb-8">
                <Typography as="h2" variant="h2" glow="cyan" className="mb-2 text-center">
                    THE LEADERBOARD
                </Typography>
                <Typography as="p" color="muted" className="text-center">
                    Current standings of the Puzzle crew
                </Typography>
            </div>

            <div className="space-y-3">
                {players.map((player) => (
                    <PlayerCard key={player.id} {...player} />
                ))}
            </div>
        </Container>
    );
};
