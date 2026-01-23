import type { PlayersApiResponse } from "@/models/Player";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface FetchPlayersParams {
    from?: Date;
    to?: Date;
}

export async function fetchPlayers(params?: FetchPlayersParams): Promise<PlayersApiResponse> {
    const url = new URL(`${API_BASE_URL}/players`, window.location.origin);

    if (params?.from) {
        url.searchParams.set('from', params.from.toISOString().split('T')[0]);
    }
    if (params?.to) {
        url.searchParams.set('to', params.to.toISOString().split('T')[0]);
    }

    const response = await fetch(url.toString());

    console.log(response);
    if (!response.ok) {
        throw new Error(`Failed to fetch players: ${response.statusText}`);
    }
    return response.json();
}
