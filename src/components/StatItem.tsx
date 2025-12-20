import { Text } from "@/core-components/Text";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatItemProps {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    isPositive?: boolean;
    className?: string;
}

export const StatItem = ({ label, value, trend, isPositive, className }: StatItemProps) => {
    return (
        <div className="flex flex-col items-end">
            <Text variant="label" color="muted" className="mb-0 text-[10px] uppercase tracking-wider font-medium opacity-70">
                {label}
            </Text>
            <div className="flex items-center gap-1 justify-end">
                {trend && (
                    trend === "up" ? <TrendingUp className="w-4 h-4 text-success" /> :
                        trend === "down" ? <TrendingDown className="w-4 h-4 text-destructive" /> : null
                )}
                <Text
                    variant="stat"
                    className={`text-xl font-bold tracking-tight ${isPositive === true ? "text-success glow-text-cyan" :
                            isPositive === false ? "text-destructive" : ""
                        } ${className || ""}`.trim()}
                >
                    {value}
                </Text>
            </div>
        </div>
    );
};
