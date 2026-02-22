import { useEffect, useState } from "react";
import { Container } from "@/core-components/Container";
import { Text } from "@/core-components/Text";
import { ArenaPlayerCard } from "@/components/ArenaPlayerCard";
import type { ArenaPlayer, ArenaPlayerApiResponse, ArenaSortOption } from "@/models/ArenaPlayer";
import { fetchArenaLeaderboard } from "@/services/api";

type SortDirection = "ASC" | "DESC";

function mapToArenaPlayer(
    item: ArenaPlayerApiResponse,
    rankPosition: number,
): ArenaPlayer {
    return {
        playerId: item.playerId,
        rankPosition,
        name: item.name,
        tagLine: item.tagLine,
        profileIconId: item.profileIconId,
        totalGames: item.totalGames,
        avgPlacement: item.avgPlacement,
        winRate: item.winRate,
        top4Rate: item.top4Rate,
        avgDamageToChampions: item.avgDamageToChampions,
        seasonKda: item.seasonKda,
        bestMatchKda: item.bestMatchKda,
        totalKills: item.totalKills,
        totalDeaths: item.totalDeaths,
        totalAssists: item.totalAssists,
        totalPentaKills: item.totalPentaKills,
        bestKillingSpree: item.bestKillingSpree,
    };
}

export const ArenaLeaderboard = () => {
    const [rawData, setRawData] = useState<ArenaPlayerApiResponse[]>([]);
    const [displayedPlayers, setDisplayedPlayers] = useState<ArenaPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<ArenaSortOption>("AVG_PLACEMENT");
    const [sortDirection, setSortDirection] = useState<SortDirection>("ASC");

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchArenaLeaderboard();
                setRawData(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load Arena leaderboard");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (rawData.length === 0) return;

        const sorted = [...rawData].sort((a, b) => {
            let diff = 0;
            if (sortBy === "AVG_PLACEMENT") diff = a.avgPlacement - b.avgPlacement;
            else if (sortBy === "WIN_RATE") diff = b.winRate - a.winRate;
            else if (sortBy === "TOP4_RATE") diff = b.top4Rate - a.top4Rate;
            else if (sortBy === "AVG_DAMAGE") diff = b.avgDamageToChampions - a.avgDamageToChampions;
            else if (sortBy === "GAMES_PLAYED") diff = b.totalGames - a.totalGames;
            else if (sortBy === "KDA") diff = b.seasonKda - a.seasonKda;
            else if (sortBy === "BEST_KILLING_SPREE") diff = b.bestKillingSpree - a.bestKillingSpree;

            return sortDirection === "ASC" ? diff : -diff;
        });

        setDisplayedPlayers(sorted.map((item, index) => mapToArenaPlayer(item, index + 1)));
    }, [rawData, sortBy, sortDirection]);

    const handleSort = (type: ArenaSortOption) => {
        if (sortBy === type) {
            setSortDirection((prev) => (prev === "ASC" ? "DESC" : "ASC"));
        } else {
            setSortBy(type);
            // AVG_PLACEMENT is "lower is better" → default ASC; others are "higher is better" → default DESC
            setSortDirection(type === "AVG_PLACEMENT" ? "ASC" : "DESC");
        }
    };

    const getSortButtonClass = (type: ArenaSortOption) =>
        `px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
            sortBy === type
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
        }`;

    if (loading) {
        return (
            <Container className="py-12 text-center">
                <Text variant="h3" color="muted">Loading Arena leaderboard...</Text>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-12 text-center">
                <Text variant="h3" color="destructive">{error}</Text>
            </Container>
        );
    }

    if (displayedPlayers.length === 0) {
        return (
            <Container className="py-12 text-center">
                <Text variant="h3" color="muted">No Arena data yet.</Text>
                <Text variant="body" color="muted" className="mt-2">
                    Load matches first to populate Arena stats.
                </Text>
            </Container>
        );
    }

    return (
        <Container className="py-8 sm:py-12">
            <div className="mb-8 text-center">
                <Text as="h2" variant="h2" glow="cyan" className="mb-2">
                    ARENA LEADERBOARD
                </Text>
                <Text as="p" color="muted" className="mb-6">
                    2v2v2v2 chaos — who reigns the Arena?
                </Text>

                {/* Sort Controls */}
                <div className="flex flex-wrap items-center gap-y-1 justify-center">
                    <button onClick={() => handleSort("AVG_PLACEMENT")} className={getSortButtonClass("AVG_PLACEMENT")}>
                        Avg Placement
                        {sortBy === "AVG_PLACEMENT" && <span className="text-xs">{sortDirection === "ASC" ? "▲" : "▼"}</span>}
                    </button>

                    <button onClick={() => handleSort("WIN_RATE")} className={getSortButtonClass("WIN_RATE")}>
                        Win Rate
                        {sortBy === "WIN_RATE" && <span className="text-xs">{sortDirection === "DESC" ? "▼" : "▲"}</span>}
                    </button>

                    <button onClick={() => handleSort("TOP4_RATE")} className={getSortButtonClass("TOP4_RATE")}>
                        Top 4 Rate
                        {sortBy === "TOP4_RATE" && <span className="text-xs">{sortDirection === "DESC" ? "▼" : "▲"}</span>}
                    </button>

                    <button onClick={() => handleSort("AVG_DAMAGE")} className={getSortButtonClass("AVG_DAMAGE")}>
                        Avg Damage
                        {sortBy === "AVG_DAMAGE" && <span className="text-xs">{sortDirection === "DESC" ? "▼" : "▲"}</span>}
                    </button>

                    <div className="w-px h-4 bg-white/10 mx-2" />

                    <button onClick={() => handleSort("GAMES_PLAYED")} className={getSortButtonClass("GAMES_PLAYED")}>
                        Most Games
                        {sortBy === "GAMES_PLAYED" && <span className="text-xs">{sortDirection === "DESC" ? "▼" : "▲"}</span>}
                    </button>

                    <button onClick={() => handleSort("KDA")} className={getSortButtonClass("KDA")}>
                        Best KDA
                        {sortBy === "KDA" && <span className="text-xs">{sortDirection === "DESC" ? "▼" : "▲"}</span>}
                    </button>

                    <button onClick={() => handleSort("BEST_KILLING_SPREE")} className={getSortButtonClass("BEST_KILLING_SPREE")}>
                        Best Spree
                        {sortBy === "BEST_KILLING_SPREE" && <span className="text-xs">{sortDirection === "DESC" ? "▼" : "▲"}</span>}
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {displayedPlayers.map((player) => (
                    <ArenaPlayerCard
                        key={player.playerId}
                        {...player}
                        sortBy={sortBy}
                    />
                ))}
            </div>
        </Container>
    );
};
