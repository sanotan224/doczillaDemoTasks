export interface IWeatherApiData {
    locationName: string;
    latitude: number;
    longitude: number;
    hourly: {
        time: string[];
        temperature_2m: number[];
    };
    timestamp: number;
}