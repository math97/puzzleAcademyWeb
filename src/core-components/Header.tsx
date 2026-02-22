import { Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Container } from "./Container";
import { Text } from "./Text";
import { Countdown } from "@/components/Countdown";
import { cn } from "@/lib/utils";

export const Header = () => {
    const { pathname } = useLocation();

    return (
        <header className="relative overflow-hidden py-8 sm:py-12">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

            <Container className="relative text-center space-y-4 sm:space-y-6">
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                    <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-accent animate-pulse" />
                    <Text as="h1" variant="h1" glow="amber">
                        PUZZLES ACADEMY
                    </Text>
                    <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-accent animate-pulse" />
                </div>

                <Text as="p" variant="h3" color="muted" className="italic font-medium">
                    "Why is it called Puzzles? That's the puzzle!"
                </Text>

                {/* Navigation */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-background/50 border border-white/10 p-1 rounded-lg backdrop-blur-sm">
                        <Link
                            to="/"
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                pathname === "/"
                                    ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            RANKED
                        </Link>
                        <Link
                            to="/arena"
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                pathname === "/arena"
                                    ? "bg-orange-500/20 text-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.2)]"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            ARENA
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Countdown />
                </div>
            </Container>
        </header>
    );
};
