import { useEffect, useState } from "react";
import { Text } from "@/core-components/Text";
import { GlassCard } from "@/core-components/GlassCard";

export const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const nextHour = new Date(now);
            nextHour.setHours(now.getHours() + 1);
            nextHour.setMinutes(0);
            nextHour.setSeconds(0);
            nextHour.setMilliseconds(0);

            const diff = nextHour.getTime() - now.getTime();

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours, minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <GlassCard className="inline-block px-8 py-4">
            <Text variant="label" color="muted" className="mb-2">
                Next Snapshot In
            </Text>
            <div className="flex items-center gap-2">
                <Text variant="statValue" color="primary" glow="cyan">
                    {String(timeLeft.hours).padStart(2, "0")}
                </Text>
                <Text variant="statValue" color="muted">
                    :
                </Text>
                <Text variant="statValue" color="primary" glow="cyan">
                    {String(timeLeft.minutes).padStart(2, "0")}
                </Text>
                <Text variant="statValue" color="muted">
                    :
                </Text>
                <Text variant="statValue" color="primary" glow="cyan">
                    {String(timeLeft.seconds).padStart(2, "0")}
                </Text>
            </div>
        </GlassCard>
    );
};
