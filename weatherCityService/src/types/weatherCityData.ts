import {IForecastData} from "./forecastData";

export interface IWeatherLocationData {
    locationName: string;
    forecast: IForecastData[];
}