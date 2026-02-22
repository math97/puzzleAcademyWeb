import { Header } from "@/core-components/Header";
import { ArenaLeaderboard } from "@/components/ArenaLeaderboard";

const ArenaPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <ArenaLeaderboard />
            </main>
        </div>
    );
};

export default ArenaPage;
