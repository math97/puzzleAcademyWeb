import { useState } from "react";
import type { Player } from "../models/Player";
import { GlassCard } from "@/core-components/GlassCard";
import { Text } from "@/core-components/Text";
import { Badge } from "@/core-components/Badge";
import { RankBadge } from "@/components/RankBadge";
import { StatItem } from "@/components/StatItem";
import { cn } from "@/lib/utils";
import { getTierClasses } from "@/lib/tier";

interface PlayerCardProps extends Player {
    sortBy?: 'RANK' | 'PDL_CHANGE' | 'WINRATE' | 'LEVEL' | 'SEASON_KILLS' | 'SEASON_DEATHS' | 'SEASON_ASSISTS' | 'SEASON_KDA' | 'BEST_KDA';
}

export const PlayerCard = ({
    rankPosition,
    name,
    tagline,
    tier,
    rankLabel,
    pdl,
    pdlChange,
    role,
    winrate,
    summonerLevel,
    championMasteries,
    mainChampions = ["Ahri", "Zed", "Yasuo"],
    stats,
    seasonKda = 0,
    bestMatchKda = 0,
    sortBy = 'RANK'
}: PlayerCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isWinning = winrate >= 50;
    const tierClasses = getTierClasses(tier);

    // Determine PDL change color and formatted text
    const pdlChangeText = pdlChange > 0
        ? `+${pdlChange}`
        : pdlChange.toString();

    let dynamicStatLabel = "LVL";
    let dynamicStatValue = summonerLevel?.toString() || "0";
    let dynamicStatColor = "text-primary";

    if (sortBy === 'SEASON_KILLS') {
        dynamicStatLabel = "KILLS";
        dynamicStatValue = stats?.totalKills.toString() || "0";
        dynamicStatColor = "text-success";
    } else if (sortBy === 'SEASON_DEATHS') {
        dynamicStatLabel = "DEATHS";
        dynamicStatValue = stats?.totalDeaths.toString() || "0";
        dynamicStatColor = "text-destructive";
    } else if (sortBy === 'SEASON_ASSISTS') {
        dynamicStatLabel = "ASSISTS";
        dynamicStatValue = stats?.totalAssists.toString() || "0";
        dynamicStatColor = "text-accent";
    }

    return (
        <GlassCard
            className={`p-4 ${rankPosition === 1 ? 'rank-gold' : ''}`}
            hoverEffect
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Row 1 (mobile): Rank badge + player info */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                        <RankBadge rank={rankPosition} />
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Text variant="h3">{name}</Text>
                            <Text variant="body" color="muted" className="text-sm">#{tagline}</Text>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Badge
                                variant="outline"
                                className={cn("uppercase text-[10px] sm:text-xs", tierClasses.text, tierClasses.border)}
                            >
                                {tier} {rankLabel} • {pdl} PDL
                            </Badge>
                            <Text color="muted">{role}</Text>
                        </div>
                    </div>
                </div>

                {/* Stats — 3-col grid on mobile, flex row on sm+ */}
                <div className="grid grid-cols-3 sm:flex sm:items-center gap-x-3 gap-y-1 sm:gap-6 sm:text-right text-left pl-[3.25rem] sm:pl-0">
                    <StatItem
                        label="WINRATE"
                        value={`${winrate}%`}
                        isPositive={isWinning}
                        className={isWinning ? "text-success" : "text-destructive"}
                    />
                    <StatItem
                        label="PDL CHANGE"
                        value={pdlChangeText}
                        isPositive={pdlChange > 0}
                        className={pdlChange > 0 ? "text-success" : pdlChange < 0 ? "text-destructive" : "text-muted-foreground"}
                    />
                    <div className="flex flex-col items-start sm:items-end">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">
                            {dynamicStatLabel}
                        </span>
                        <span className={`text-base sm:text-xl font-bold tracking-tight ${dynamicStatColor}`}>
                            {dynamicStatValue}
                        </span>
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <StatItem
                            label="SEASON KDA"
                            value={seasonKda.toFixed(2)}
                            className="text-primary"
                        />
                    </div>
                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <StatItem
                            label="BEST KDA"
                            value={bestMatchKda.toFixed(1)}
                            className="text-foreground"
                        />
                    </div>
                </div>
            </div>

            {/* Hover Effect - Main Champions */}
            {isHovered && (
                <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in duration-200">
                    <Text variant="label" color="muted" className="mb-2">Main Champions</Text>
                    <div className="flex gap-2">
                        {championMasteries && championMasteries.length > 0 ? (
                            championMasteries.map((mastery) => (
                                <div key={mastery.championId} className="flex flex-col items-center gap-1 group/champ relative">
                                    {mastery.championImage ? (
                                        <div className="relative">
                                            <img
                                                src={mastery.championImage}
                                                alt={mastery.championName || 'Champion'}
                                                className="w-8 h-8 rounded-full border border-white/10 group-hover/champ:border-primary/50 transition-colors"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-black/80 text-[10px] px-1 rounded-full border border-white/10 text-white font-medium">
                                                {mastery.championLevel}
                                            </div>
                                        </div>
                                    ) : (
                                        <Badge variant="default" className="w-8 h-8 flex items-center justify-center p-0">
                                            {mastery.championLevel}
                                        </Badge>
                                    )}
                                    <span className="text-[10px] text-muted-foreground opacity-0 group-hover/champ:opacity-100 transition-opacity absolute -bottom-4 whitespace-nowrap">
                                        {mastery.championName}
                                    </span>
                                </div>
                            ))
                        ) : (
                            mainChampions.map((champ) => (
                                <Badge key={champ} variant="default">
                                    {champ}
                                </Badge>
                            ))
                        )}
                    </div>
                </div>
            )}
        </GlassCard>
    );
};
