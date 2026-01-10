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
        this.router.get('/', this.weatherController.getWeatherChart.bind(this.weatherController));
    }
}