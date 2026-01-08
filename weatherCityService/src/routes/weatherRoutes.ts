import { Router } from 'express';
import {WeatherController} from "../controllers/weatherController";

const router = Router();

const weatherController = new WeatherController();

router.get('/data', (req, res) => weatherController.getWeather(req, res));
router.get('/chart', (req, res) => weatherController.getWeatherChart(req, res));

export default router;