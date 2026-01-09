import { Router } from 'express';
import {WeatherController} from "../controllers/weatherController";

export class WeatherRoutes {
    private readonly router: Router;
    private weatherController: WeatherController;

    constructor() {
        this.router = Router();
        this.weatherController = new WeatherController();
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes(): void {
        this.router.get('/data', this.weatherController.getWeather);
        this.router.get('/chart', this.weatherController.getWeatherChart);
    }
}