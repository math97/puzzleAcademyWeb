import { useState } from "react";
import type { ArenaPlayer, ArenaSortOption } from "@/models/ArenaPlayer";
import { GlassCard } from "@/core-components/GlassCard";
import { Text } from "@/core-components/Text";
import { StatItem } from "@/components/StatItem";
import { cn } from "@/lib/utils";

interface ArenaPlayerCardProps extends ArenaPlayer {
    sortBy?: ArenaSortOption;
}

function getPlacementMedal(position: number): string {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return "";
}

function getPlacementColor(avgPlacement: number): string {
    if (avgPlacement <= 2) return "text-amber-400";
    if (avgPlacement <= 4) return "text-primary";
    return "text-muted-foreground";
}

export const ArenaPlayerCard = ({
    rankPosition,
    name,
    tagLine,
    avgPlacement,
    totalGames,
    winRate,
    top4Rate,
    avgDamageToChampions,
    seasonKda,
    bestMatchKda,
    totalKills,
    totalDeaths,
    totalAssists,
    totalPentaKills,
    bestKillingSpree,
    sortBy = "AVG_PLACEMENT",
}: ArenaPlayerCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isFirst = rankPosition === 1;
    const medal = getPlacementMedal(rankPosition);
    const placementColor = getPlacementColor(avgPlacement);

    let dynamicStatLabel = "AVG PLACE";
    let dynamicStatValue = avgPlacement.toFixed(2);
    let dynamicStatColor = placementColor;

    if (sortBy === "WIN_RATE") {
        dynamicStatLabel = "WIN RATE";
        dynamicStatValue = `${winRate}%`;
        dynamicStatColor = winRate >= 12.5 ? "text-green-400" : "text-destructive";
    } else if (sortBy === "TOP4_RATE") {
        dynamicStatLabel = "TOP 4 RATE";
        dynamicStatValue = `${top4Rate}%`;
        dynamicStatColor = top4Rate >= 50 ? "text-primary" : "text-muted-foreground";
    } else if (sortBy === "AVG_DAMAGE") {
        dynamicStatLabel = "AVG DMG";
        dynamicStatValue = (avgDamageToChampions / 1000).toFixed(1) + "k";
        dynamicStatColor = "text-orange-400";
    } else if (sortBy === "GAMES_PLAYED") {
        dynamicStatLabel = "GAMES";
        dynamicStatValue = totalGames.toString();
        dynamicStatColor = "text-primary";
    } else if (sortBy === "KDA") {
        dynamicStatLabel = "SEASON KDA";
        dynamicStatValue = seasonKda.toFixed(2);
        dynamicStatColor = "text-primary";
    } else if (sortBy === "BEST_KILLING_SPREE") {
        dynamicStatLabel = "BEST SPREE";
        dynamicStatValue = bestKillingSpree.toString();
        dynamicStatColor = "text-orange-400";
    }

    return (
        <GlassCard
            className={cn("p-4", isFirst && "rank-gold")}
            hoverEffect
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Row 1: Position + player info */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Position badge */}
                    <div className="flex-shrink-0">
                        <div
                            className={cn(
                                "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-display transition-colors",
                                isFirst ? "bg-accent/20 text-accent" : "bg-muted text-foreground",
                            )}
                        >
                            {medal ? (
                                <span className="text-xl sm:text-2xl">{medal}</span>
                            ) : (
                                <Text
                                    variant="stat"
                                    className={cn("text-xl sm:text-2xl", isFirst ? "text-accent" : "text-foreground")}
                                    glow={isFirst ? "amber" : "none"}
                                >
                                    {rankPosition}
                                </Text>
                            )}
                        </div>
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Text variant="h3">{name}</Text>
                            <Text variant="body" color="muted" className="text-sm">#{tagLine}</Text>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                {totalGames} games
                            </span>
                            <span className={cn("text-xs font-medium uppercase tracking-wider", placementColor)}>
                                avg #{avgPlacement.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 sm:flex sm:items-center gap-x-3 gap-y-1 sm:gap-6 sm:text-right text-left pl-[3.25rem] sm:pl-0">
                    <StatItem
                        label="TOP 4 RATE"
                        value={`${top4Rate}%`}
                        isPositive={top4Rate >= 50}
                        className={top4Rate >= 50 ? "text-primary" : "text-muted-foreground"}
                    />
                    <StatItem
                        label="WIN RATE"
                        value={`${winRate}%`}
                        isPositive={winRate >= 12.5}
                        className={winRate >= 12.5 ? "text-green-400" : "text-destructive"}
                    />
                    <div className="flex flex-col items-start sm:items-end">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">
                            {dynamicStatLabel}
                        </span>
                        <span className={cn("text-base sm:text-xl font-bold tracking-tight", dynamicStatColor)}>
                            {dynamicStatValue}
                        </span>
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <StatItem
                            label="AVG DMG"
                            value={`${(avgDamageToChampions / 1000).toFixed(1)}k`}
                            className="text-orange-400"
                        />
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <StatItem
                            label="SEASON KDA"
                            value={seasonKda.toFixed(2)}
                            className="text-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Hover — detailed stats */}
            {isHovered && (
                <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in duration-200">
                    <Text variant="label" color="muted" className="mb-3">Arena Stats</Text>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">KDA</span>
                            <span className="text-sm font-bold text-foreground">
                                {totalKills}/{totalDeaths}/{totalAssists}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Best KDA</span>
                            <span className="text-sm font-bold text-primary">{bestMatchKda.toFixed(1)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Best Spree</span>
                            <span className="text-sm font-bold text-orange-400">{bestKillingSpree}</span>
                        </div>
                        {totalPentaKills > 0 && (
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Penta Kills</span>
                                <span className="text-sm font-bold text-amber-400">{totalPentaKills}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </GlassCard>
    );
};
