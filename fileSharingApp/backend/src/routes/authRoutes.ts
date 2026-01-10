import {Router} from "express";
import {AuthController} from "../controllers/authController";

export class AuthRoutes {
    private readonly router: Router;
    private authController: AuthController;

    constructor() {
        this.router = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes(): void {
        this.router.post('/register', this.authController.register.bind(this.authController));
        this.router.post('/login', this.authController.login.bind(this.authController));
    }
}