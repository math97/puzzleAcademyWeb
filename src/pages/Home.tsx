import { Header } from "../core-components/Header";
import { Leaderboard } from "../components/Leaderboard";

const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <Leaderboard />
            </main>
        </div>
    );
};

export default Home;
