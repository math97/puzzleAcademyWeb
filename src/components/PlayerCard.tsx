import { useState } from "react";
import type { Player } from "../models/Player";
import { GlassCard } from "@/core-components/GlassCard";
import { Text } from "@/core-components/Text";
import { Badge } from "@/core-components/Badge";
import { RankBadge } from "@/components/RankBadge";
import { StatItem } from "@/components/StatItem";

interface PlayerCardProps extends Player { }

export const PlayerCard = ({
    rankPosition,
    name,
    tagline,
    tier,
    rankLabel,
    role,
    winrate,
    pdlChange,
    summonerLevel,
    mainChampions = ["Ahri", "Zed", "Yasuo"]
}: PlayerCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isPositive = pdlChange > 0;
    const isWinning = winrate >= 50;

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
                        {summonerLevel && (
                            <Badge variant="default" className="text-xs py-0 h-5">
                                Lvl {summonerLevel}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Badge variant="primary">{tier} {rankLabel}</Badge>
                        <Text color="muted">{role}</Text>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-right">
                    <StatItem
                        label="Winrate"
                        value={`${winrate}%`}
                        isPositive={isWinning}
                    />
                    <StatItem
                        label="PDL Change"
                        value={`${isPositive ? '+' : ''}${pdlChange}`}
                        trend={isPositive ? "up" : "down"}
                        isPositive={isPositive}
                    />
                </div>
            </div>

            {/* Hover Effect - Main Champions */}
            {isHovered && (
                <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in duration-200">
                    <Text variant="label" color="muted" className="mb-2">Main Champions</Text>
                    <div className="flex gap-2">
                        {mainChampions.map((champ) => (
                            <Badge key={champ} variant="default">
                                {champ}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </GlassCard>
    );
};
