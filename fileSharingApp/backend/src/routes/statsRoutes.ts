import { Router } from 'express';
import {StatsController} from "../controllers/statsController";
import {MiddlewareAuth} from "../middleware/auth";

export class StatsRoute {
    private readonly router: Router;
    private statsController: StatsController;
    private auth: MiddlewareAuth;

    constructor() {
        this.router = Router();
        this.statsController = new StatsController();
        this.auth = new MiddlewareAuth();
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes(): void {
        this.router.get('/overall', this.auth.authenticate, this.statsController.getStats);
    }
}
