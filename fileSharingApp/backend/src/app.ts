import express, {Application} from 'express';
import cors from 'cors';
import {FileRoutes} from './routes/fileRoutes';
import {StatsRoute} from './routes/statsRoutes';
import {AuthRoutes} from "./routes/authRoutes";
import {CleanupService} from './services/cleanupService';

export class App {
    private app: Application;
    private readonly port: number;
    private cleanupService: CleanupService;

    constructor() {
        this.app = express();
        this.port =  3000;
        this.cleanupService = new CleanupService();

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeRoutes(): void {
        this.app.use('/api/auth', new AuthRoutes().getRouter());
        this.app.use('/api/files', new FileRoutes().getRouter());
        this.app.use('/api/stats', new StatsRoute().getRouter());
    }

    public async start(): Promise<void> {
        await this.cleanupService.startCleanupService()

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

const app = new App();
app.start()