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
                "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-display transition-colors",
                isFirst ? "bg-accent/20 text-accent" : "bg-muted text-foreground",
                className
            )}
        >
            <Text
                variant="stat"
                glow={isFirst ? "amber" : "none"}
                className={cn("text-xl sm:text-2xl", isFirst ? "text-accent" : "text-foreground")}
            >
                {rank}
            </Text>
        </div>
    );
};
