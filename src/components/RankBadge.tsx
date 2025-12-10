import { cn } from "@/lib/utils";
import { Text } from "@/core-components/Text";

interface RankBadgeProps {
    rank: number;
    className?: string;
}

export const RankBadge = ({ rank, className }: RankBadgeProps) => {
    const isFirst = rank === 1;

    return (
        <div
            className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center font-display text-2xl transition-colors",
                isFirst ? "bg-accent/20 text-accent" : "bg-muted text-foreground",
                className
            )}
        >
            <Text
                variant="stat"
                glow={isFirst ? "amber" : "none"}
                className={cn(isFirst ? "text-accent" : "text-foreground")}
            >
                {rank}
            </Text>
        </div>
    );
};
