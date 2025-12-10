import { Text } from "@/core-components/Text";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatItemProps {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
    isPositive?: boolean;
}

export const StatItem = ({ label, value, trend, isPositive }: StatItemProps) => {
    return (
        <div>
            <Text variant="label" color="muted" className="mb-1">
                {label}
            </Text>
            <div className="flex items-center gap-1">
                {trend && (
                    trend === "up" ? <TrendingUp className="w-5 h-5 text-success" /> :
                        trend === "down" ? <TrendingDown className="w-5 h-5 text-destructive" /> : null
                )}
                <Text
                    variant="stat"
                    className={
                        isPositive === true ? "text-success glow-text-cyan" :
                            isPositive === false ? "text-destructive" : ""
                    }
                >
                    {value}
                </Text>
            </div>
        </div>
    );
};
