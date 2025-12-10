import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

import type { Player } from "../models/Player";

interface PlayerCardProps extends Player { }

export const PlayerCard = ({
    rank,
    name,
    tagline,
    tier,
    role,
    winrate,
    lpChange,
    mainChampions = ["Ahri", "Zed", "Yasuo"]
}: PlayerCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isPositive = lpChange > 0;
    const isWinning = winrate >= 50;

    return (
        <div
            className={`glass-card p-4 transition-all duration-300 ${rank === 1 ? 'rank-gold' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-display text-2xl ${rank === 1 ? 'bg-accent/20 text-accent glow-text-amber' : 'bg-muted text-foreground'
                        }`}>
                        {rank}
                    </div>
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-xl truncate">{name}</h3>
                        <span className="text-muted-foreground text-sm">#{tagline}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary uppercase text-xs font-medium">
                            {tier}
                        </span>
                        <span className="text-muted-foreground">{role}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-right">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Winrate</p>
                        <p className={`text-xl font-display ${isWinning ? 'stat-positive' : 'stat-negative'}`}>
                            {winrate}%
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">LP Change</p>
                        <div className={`flex items-center gap-1 text-xl font-display ${isPositive ? 'stat-positive' : 'stat-negative'
                            }`}>
                            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            <span>{isPositive ? '+' : ''}{lpChange}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Effect - Main Champions */}
            {isHovered && (
                <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in duration-200">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Main Champions</p>
                    <div className="flex gap-2">
                        {mainChampions.map((champ) => (
                            <div
                                key={champ}
                                className="px-3 py-1.5 rounded-md bg-secondary/50 text-sm border border-primary/20"
                            >
                                {champ}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
