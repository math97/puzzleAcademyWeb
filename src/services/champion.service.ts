import championData from '../data/champion.json';

// Type definition for the champion data structure
interface ChampionDto {
    version: string;
    id: string;
    key: string;
    name: string;
    title: string;
    blurb: string;
    info: {
        attack: number;
        defense: number;
        magic: number;
        difficulty: number;
    };
    image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
    };
    tags: string[];
    partype: string;
    stats: any;
}

interface ChampionDataWrapper {
    type: string;
    format: string;
    version: string;
    data: Record<string, ChampionDto>;
}

const champions = (championData as ChampionDataWrapper).data;

// Create a lookup map for efficiency: key (id as string) -> ChampionDto
const championIdMap: Record<string, ChampionDto> = {};
Object.values(champions).forEach((champ) => {
    championIdMap[champ.key] = champ;
});

export const ChampionService = {
    getChampionById: (id: number): ChampionDto | undefined => {
        return championIdMap[id.toString()];
    },

    getChampionImageUrl: (championId: string): string => {
        // Use the same version as the data we downloaded
        return `https://ddragon.leagueoflegends.com/cdn/${championData.version}/img/champion/${championId}.png`;
    }
};
