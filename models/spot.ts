export type SpotType = 'stunt' | 'foto' | 'kurve' | 'sonstig';

export interface Spot {
    id: string;
    title: string;
    description?: string;
    type: SpotType;
    latitude: number;
    longitude: number;
    createdAt: string;
}
