import axios from 'axios';
import { CacheService } from './cacheService';
import {ICityCoordinates} from "../types/cityCoordinates";
import {IWeatherApiData} from "../types/weatherApiData";
import {IWeatherLocationData} from "../types/weatherCityData";

export class WeatherService {
    private cacheService: CacheService;
    private readonly GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
    private readonly WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

    constructor() {
        this.cacheService = new CacheService();
    }

    async getCityCoordinates(city: string): Promise<ICityCoordinates> {
        try {
            const response = await axios.get(this.GEOCODING_API, {
                params: { name: city }
            });

            if (!response.data.results || response.data.results.length === 0) {
                throw new Error(`City "${city}" not found`);
            }

            const cityData = response.data.results[0];
            return {
                name: cityData.name + ", " + cityData.country,
                latitude: cityData.latitude,
                longitude: cityData.longitude,
            };
        } catch (error) {
            throw new Error(`Failed to get coordinates for "${city}": ${(error as any).message}`);
        }
    }

    async getWeatherForecast(city: string): Promise<IWeatherApiData> {
        const cacheKey = `weather:${city.toLowerCase()}`;
        const cachedData = await this.cacheService.get<IWeatherApiData>(cacheKey);

        if (cachedData) {
            console.log(`Returning cached data for ${city}`);
            return cachedData;
        }

        console.log(`Fetching data for ${city}`);

        const coordinates = await this.getCityCoordinates(city);

        const response = await axios.get(this.WEATHER_API, {
            params: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                hourly: 'temperature_2m',
            }
        });
        const weatherData: IWeatherApiData = {
            locationName: coordinates.name,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            hourly: response.data.hourly,
            timestamp: Date.now()
        };
        await this.cacheService.set(cacheKey, weatherData);
        return weatherData;
    }

    async getCurrentWeather(city: string): Promise<IWeatherLocationData> {
        const weatherData = await this.getWeatherForecast(city);
        const forecast = weatherData.hourly.time.slice(0, 24).map((time, index) => ({
            time: new Date(time).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            temperature: weatherData.hourly.temperature_2m[index]
        }));

        return {
            locationName: weatherData.locationName,
            forecast,
        };
    }
}