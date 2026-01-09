import express, {Application} from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes';
import authRoutes from './routes/authRoutes';
import statsRoutes from './routes/statsRoutes';
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
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/files', fileRoutes);
        this.app.use('/api/stats', statsRoutes);
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