import type { PlayersApiResponse } from "@/models/Player";
import type { ArenaPlayerApiResponse } from "@/models/ArenaPlayer";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function fetchPlayers(): Promise<PlayersApiResponse> {
    const response = await fetch(`${API_BASE_URL}/players`);

    console.log(response);
    if (!response.ok) {
        throw new Error(`Failed to fetch players: ${response.statusText}`);
    }
    return response.json();
}

export async function fetchArenaLeaderboard(): Promise<ArenaPlayerApiResponse[]> {
    const response = await fetch(`${API_BASE_URL}/players/leaderboard/arena`);
    if (!response.ok) {
        throw new Error(`Failed to fetch arena leaderboard: ${response.statusText}`);
    }
    return response.json();
}
