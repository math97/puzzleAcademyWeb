import { Container } from "../core-components/Container";
import { Text as Typography } from "@/core-components/Text";
import { PlayerCard } from "./PlayerCard";
import type { Player } from "../models/Player";

const mockPlayers: Player[] = [
    {
        rank: 1,
        name: "ShadowFlame",
        tagline: "EUW",
        tier: "Challenger",
        role: "Mid",
        winrate: 67,
        lpChange: 145,
        mainChampions: ["Azir", "Orianna", "Syndra"]
    },
    {
        rank: 2,
        name: "JungleKing",
        tagline: "NA1",
        tier: "Grandmaster",
        role: "Jungle",
        winrate: 58,
        lpChange: 87,
        mainChampions: ["Lee Sin", "Elise", "Graves"]
    },
    {
        rank: 3,
        name: "BotLaneGod",
        tagline: "EUW",
        tier: "Master",
        role: "ADC",
        winrate: 54,
        lpChange: 56,
        mainChampions: ["Jinx", "Caitlyn", "Aphelios"]
    },
    {
        rank: 4,
        name: "SupportCarry",
        tagline: "KR",
        tier: "Diamond I",
        role: "Support",
        winrate: 51,
        lpChange: 23,
        mainChampions: ["Thresh", "Nautilus", "Leona"]
    },
    {
        rank: 5,
        name: "TopDiff",
        tagline: "NA1",
        tier: "Diamond II",
        role: "Top",
        winrate: 47,
        lpChange: -34,
        mainChampions: ["Darius", "Garen", "Sett"]
    },
    {
        rank: 6,
        name: "TrollMaster",
        tagline: "EUW",
        tier: "Diamond III",
        role: "Fill",
        winrate: 42,
        lpChange: -78,
        mainChampions: ["Teemo", "Yuumi", "Singed"]
    }
];

export const Leaderboard = () => {
    return (
        <Container className="py-12">
            <div className="mb-8">
                <Typography as="h2" variant="h2" glow="cyan" className="mb-2 text-center">
                    THE LEADERBOARD
                </Typography>
                <Typography as="p" color="muted" className="text-center">
                    Current standings of the Puzzle crew
                </Typography>
            </div>

            <div className="space-y-3">
                {mockPlayers.map((player) => (
                    <PlayerCard key={player.rank} {...player} />
                ))}
            </div>
        </Container>
    );
};
