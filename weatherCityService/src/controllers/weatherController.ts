import { Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';
import { ChartGenerator } from '../utils/chartGenerator';

export class WeatherController {
    private weatherService: WeatherService;
    private chartGenerator: ChartGenerator;

    constructor() {
        this.weatherService = new WeatherService();
        this.chartGenerator = new ChartGenerator();
    }

    async getWeather(req: Request, res: Response): Promise<void> {
        try {
            const weatherData = await this.getWeatherData(req.query?.city as string);

            res.json({
                city: weatherData.locationName,
                forecast: weatherData.forecast,
            });

        } catch (error: any) {
            console.error('Error fetching weather:', error);
            res.status(500).json({
                error: error.message || 'Failed to fetch weather data'
            });
        }
    }

    async getWeatherChart(req: Request, res: Response): Promise<void> {
        try {
            const weatherData = await this.getWeatherData(req.query?.city as string);

            const lastDayForecast =  weatherData.forecast.slice(0, 24);

            const chartBuffer = await this.chartGenerator.generateTemperatureChart(
                lastDayForecast.map(f => f.time),
                weatherData.forecast.map(f => f.temperature),
                weatherData.locationName
            );

            res.setHeader('Content-Type', 'image/png');
            res.send(chartBuffer);

        } catch (error: any) {
            console.error('Error generating chart:', error);
            res.status(500).json({
                error: error.message || 'Failed to generate chart'
            });
        }
    }

    private async getWeatherData(city: string) {
        if (!city) {
            throw new Error('City parameter is not provided');
        }
        return await this.weatherService.getCurrentWeather(city);
    }
}