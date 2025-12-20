import { useState } from "react";
import type { Player } from "../models/Player";
import { GlassCard } from "@/core-components/GlassCard";
import { Text } from "@/core-components/Text";
import { Badge } from "@/core-components/Badge";
import { RankBadge } from "@/components/RankBadge";
import { StatItem } from "@/components/StatItem";

interface PlayerCardProps extends Player {
    sortBy?: 'RANK' | 'WINRATE' | 'LEVEL' | 'SEASON_KILLS' | 'SEASON_DEATHS' | 'SEASON_ASSISTS' | 'SEASON_KDA' | 'BEST_KDA';
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

    // Determine PDL change color and formatted text
    const pdlChangeColor = pdlChange > 0
        ? "text-emerald-400"
        : pdlChange < 0
            ? "text-rose-400"
            : "text-muted-foreground";

    const pdlChangeText = pdlChange > 0
        ? `+${pdlChange}`
        : pdlChange.toString();

    let dynamicStatLabel = "LVL";
    let dynamicStatValue = summonerLevel?.toString() || "0";
    let dynamicStatColor = "text-cyan-400";

    if (sortBy === 'SEASON_KILLS') {
        dynamicStatLabel = "KILLS";
        dynamicStatValue = stats?.totalKills.toString() || "0";
        dynamicStatColor = "text-green-400";
    } else if (sortBy === 'SEASON_DEATHS') {
        dynamicStatLabel = "DEATHS";
        dynamicStatValue = stats?.totalDeaths.toString() || "0";
        dynamicStatColor = "text-red-400";
    } else if (sortBy === 'SEASON_ASSISTS') {
        dynamicStatLabel = "ASSISTS";
        dynamicStatValue = stats?.totalAssists.toString() || "0";
        dynamicStatColor = "text-yellow-400";
    }

    return (
        <GlassCard
            className={`p-4 ${rankPosition === 1 ? 'rank-gold' : ''}`}
            hoverEffect
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-4">
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
                        <Badge variant="primary">
                            {tier} {rankLabel} • {pdl} PDL
                            <span className={`ml-1 ${pdlChangeColor}`}>
                                ({pdlChangeText})
                            </span>
                        </Badge>
                        <Text color="muted">{role}</Text>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 text-right">
                    <StatItem
                        label="WINRATE"
                        value={`${winrate}%`}
                        isPositive={isWinning}
                        className={isWinning ? "text-green-400" : "text-red-400"}
                    />
                    <StatItem
                        label="SEASON KDA"
                        value={seasonKda.toFixed(2)}
                        className="text-blue-300"
                    />
                    <StatItem
                        label="BEST KDA"
                        value={bestMatchKda.toFixed(1)} // Screenshot shows 1 decimal? or 2. using 1 for now like 3.2, 8.5
                        className="text-white"
                    />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium opacity-70">
                            {dynamicStatLabel}
                        </span>
                        <span className={`text-xl font-bold tracking-tight ${dynamicStatColor}`}>
                            {dynamicStatValue}
                        </span>
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
