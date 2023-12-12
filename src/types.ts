type IpGeo = {
  range: Array<number>;
  country: string;
  region: string;
  eu: '0' | '1';
  timezone: string;
  city: string;
  ll: [number, number];
  metro: number;
  area: number;
};

export type { IpGeo };
