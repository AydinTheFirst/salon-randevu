export interface TRApiResponse {
  data: City[];
  status: string;
}

interface City {
  altitude: number;
  area: number;
  areaCode: number[];
  coordinates: Coordinates;
  districts: District[];
  id: number;
  isCoastal: boolean;
  isMetropolitan: boolean;
  maps: Maps;
  name: string;
  nuts: Nuts;
  population: number;
  region: Region;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface District {
  area: number;
  id: number;
  name: string;
  population: number;
}

interface Maps {
  googleMaps: string;
  openStreetMap: string;
}

interface Nuts {
  nuts1: Nuts1;
  nuts2: Nuts2;
  nuts3: string;
}

interface Nuts1 {
  code: string;
  name: {
    en: string;
    tr: string;
  };
}

interface Nuts2 {
  code: string;
  name: string;
}

interface Region {
  en: string;
  tr: string;
}
