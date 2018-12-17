import { ForecastDay } from "./forecast-day";

export interface Forecast {
  city: { name: string; population: number };
  days: ForecastDay[];
}

export interface Weather {
  city: { name: string; population: number };
  day: string;
  temp: number;
  min: number;
  max: number;
  humidity: number;

}
