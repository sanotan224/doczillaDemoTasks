import express, {Application} from 'express';
import cors from 'cors';
import {WeatherRoutes} from "./routes/weatherRoutes";

export class App {
    private app: Application;
    private readonly port: number;

    constructor() {
        this.app = express();
        this.port = 3000;

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeRoutes(): void {
        this.app.use('/api/weather', new WeatherRoutes().getRouter());
    }

    public async start(): Promise<void> {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

const app = new App();
app.start();