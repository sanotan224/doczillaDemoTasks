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

    public async getWeatherChart(req: Request, res: Response): Promise<void> {
        try {
            const city = req.query.city as string;
            if (!city) {
                res.status(401).json({
                    error: 'City parameter is not provided'
                });
            }
            const weatherData = await this.weatherService.getCurrentWeather(city);

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
}