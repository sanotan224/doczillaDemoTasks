export interface WeatherData {
    locationName: string;
    latitude: number;
    longitude: number;
    hourly: {
        time: string[];
        temperature_2m: number[];
    };
    timestamp: number;
}