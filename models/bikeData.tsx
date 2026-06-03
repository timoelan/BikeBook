interface bikeDataBase {
    id: string,
    bikeID: string,
    kmStand: number,
    reifenVorne: string,
    reifenHinten: string,
    FelgenHinten: string,
    FelgenVorne: string,
    BremsenHinten: string,
    BremsenVorne: string,
    Gewicht: number,
    LeistungKW: number,
    LeistungPS: number,
    bremsflüssigkeit: string,
    kühlflüssigkeit: string,
}

interface bikeDataBenzin extends bikeDataBase {
    auspuff: string,
    tankvolumen: number,
    Hubraum: number,
    öl: string,
}

interface bikeDataElekro extends bikeDataBase {
    BatterieKapazität: number,
    öl?: string,
}

export type { bikeDataBase, bikeDataBenzin, bikeDataElekro };
