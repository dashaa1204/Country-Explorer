export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  cca2: string;
  cca3: string;
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  capital?: string[];
  flags: {
    svg: string;
    png: string;
    alt?: string;
  };
  languages?: {
    [key: string]: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  latlng?: [number, number];
  timezones?: string[];
  borders?: string[];
}

export interface CountryCardProps {
  country: Country;
}

export interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  regions: string[];
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}
