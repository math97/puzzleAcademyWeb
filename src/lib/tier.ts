export type Tier =
    | 'IRON'
    | 'BRONZE'
    | 'SILVER'
    | 'GOLD'
    | 'PLATINUM'
    | 'EMERALD'
    | 'DIAMOND'
    | 'MASTER'
    | 'GRANDMASTER'
    | 'CHALLENGER'
    | 'UNRANKED';

interface TierClasses {
    text: string;
    bg: string;
    border: string;
}

// Full class strings — never computed from template literals so Tailwind scans them correctly.
export const TIER_CLASSES: Record<Tier, TierClasses> = {
    IRON:         { text: 'text-tier-iron',        bg: 'bg-tier-iron/20',        border: 'border-tier-iron/40'        },
    BRONZE:       { text: 'text-tier-bronze',      bg: 'bg-tier-bronze/20',      border: 'border-tier-bronze/40'      },
    SILVER:       { text: 'text-tier-silver',      bg: 'bg-tier-silver/20',      border: 'border-tier-silver/40'      },
    GOLD:         { text: 'text-tier-gold',        bg: 'bg-tier-gold/20',        border: 'border-tier-gold/40'        },
    PLATINUM:     { text: 'text-tier-platinum',    bg: 'bg-tier-platinum/20',    border: 'border-tier-platinum/40'    },
    EMERALD:      { text: 'text-tier-emerald',     bg: 'bg-tier-emerald/20',     border: 'border-tier-emerald/40'     },
    DIAMOND:      { text: 'text-tier-diamond',     bg: 'bg-tier-diamond/20',     border: 'border-tier-diamond/40'     },
    MASTER:       { text: 'text-tier-master',      bg: 'bg-tier-master/20',      border: 'border-tier-master/40'      },
    GRANDMASTER:  { text: 'text-tier-grandmaster', bg: 'bg-tier-grandmaster/20', border: 'border-tier-grandmaster/40' },
    CHALLENGER:   { text: 'text-tier-challenger',  bg: 'bg-tier-challenger/20',  border: 'border-tier-challenger/40'  },
    UNRANKED:     { text: 'text-muted-foreground', bg: 'bg-muted',               border: 'border-border'              },
};

export function getTierClasses(tier: string): TierClasses {
    const key = tier.toUpperCase() as Tier;
    return TIER_CLASSES[key] ?? TIER_CLASSES.UNRANKED;
}
