import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

export const Header = () => {
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

        calculateTimeLeft(); // Initial calculation
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <header className="relative overflow-hidden py-12 px-4">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

            <div className="relative max-w-7xl mx-auto text-center space-y-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Trophy className="w-12 h-12 text-accent animate-pulse" />
                    <h1 className="text-6xl md:text-8xl font-display glow-text-amber tracking-wider">
                        PUZZLES ACADEMY
                    </h1>
                    <Trophy className="w-12 h-12 text-accent animate-pulse" />
                </div>

                <p className="text-xl md:text-2xl text-muted-foreground font-medium italic">
                    "Why is it called Puzzles? That's the puzzle!"
                </p>

                <div className="glass-card inline-block px-8 py-4">
                    <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Next Snapshot In
                    </p>
                    <div className="flex items-center gap-2 text-3xl font-display">
                        <span className="text-primary glow-text-cyan">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-muted-foreground">:</span>
                        <span className="text-primary glow-text-cyan">{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-muted-foreground">:</span>
                        <span className="text-primary glow-text-cyan">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
