export interface LogEntry {
    id: string;
    bikeID: string;
    datum: string;
    kmStand: number;
    titel: string;
    beschreibung: string;
    kosten?: number;
}
