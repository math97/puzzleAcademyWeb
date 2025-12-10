import { Trophy } from "lucide-react";
import { Container } from "./Container";
import { Text } from "./Text";
import { Countdown } from "@/components/Countdown";

export const Header = () => {
    return (
        <header className="relative overflow-hidden py-12">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

            <Container className="relative text-center space-y-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Trophy className="w-12 h-12 text-accent animate-pulse" />
                    <Text as="h1" variant="h1" glow="amber">
                        PUZZLES ACADEMY
                    </Text>
                    <Trophy className="w-12 h-12 text-accent animate-pulse" />
                </div>

                <Text as="p" variant="h3" color="muted" className="italic font-medium">
                    "Why is it called Puzzles? That's the puzzle!"
                </Text>

                <Countdown />
            </Container>
        </header>
    );
};
