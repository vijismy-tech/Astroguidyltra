
export interface District {
  name: string;
  tamilName: string;
  lat: number;
  lng: number;
}

export interface Festival {
  name: string;
  date: string;
  significance: string;
}

export interface Transit {
  planet: string;
  fromRasi: string;
  toRasi: string;
  date: string;
}

export interface PlanetaryPosition {
  planet: string;
  rasi: string;
  degrees: string;
}

export interface PanchangamData {
  tamilYear: string;
  tamilMonth: string;
  tamilDay: string;
  ayanam: string;
  ruthu: string;
  tithi: string;
  nakshatram: string;
  yogam: string;
  karanam: string;
  rasi: string;
  rahukalam: string;
  yamagandam: string;
  kuligai: string;
  nallaNeram: string;
  gowriNallaNeram: string;
  chandrashtamam: string;
  summary: string;
  planetaryPositions: PlanetaryPosition[];
  festivals: Festival[];
  transits: Transit[];
}

export interface PanchangamResponse {
  panchangam: PanchangamData;
}
