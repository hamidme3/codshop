export interface CountryCityItem {
  id: string;
  name: string;
  nameAr?: string;
  shippingFee?: number;
  sla?: string;
  isMajorHub?: boolean;
}

export interface CountryCurrency {
  code: string;
  symbol: string;
  symbolAr: string;
  position: 'after' | 'before';
}

export interface CountryPhone {
  dialCode: string;
  flag: string;
  placeholder: string;
  example: string;
  digitsLength: number | number[]; // e.g. 9 or 10
}

export interface CountryConfig {
  code: string;
  name: string;
  nameAr: string;
  currency: CountryCurrency;
  phone: CountryPhone;
  defaultShippingFee: number;
  defaultSla: string;
  freeShippingThreshold: number;
  popularCities: string[];
  knownCities: CountryCityItem[];
}
