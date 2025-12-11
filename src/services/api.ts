import type { PlayersApiResponse } from "@/models/Player";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function fetchPlayers(): Promise<PlayersApiResponse> {
    const response = await fetch(`${API_BASE_URL}/players`);

    console.log(response);
    if (!response.ok) {
        throw new Error(`Failed to fetch players: ${response.statusText}`);
    }
    return response.json();
}
