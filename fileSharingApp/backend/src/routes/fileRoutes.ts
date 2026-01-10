import { Router } from 'express';
import { FileController } from '../controllers/fileController';
import { upload } from '../middleware/upload';
import {MiddlewareAuth} from "../middleware/auth";

export class FileRoutes {
    private readonly router: Router;
    private fileController: FileController;
    private auth: MiddlewareAuth;

    constructor() {
        this.router = Router();
        this.fileController = new FileController();
        this.auth = new MiddlewareAuth();
        this.initializeRoutes();
    }

    public getRouter(): Router {
        return this.router;
    }

    private initializeRoutes(): void {
        this.router.post('/upload', this.auth.authenticate, upload.single('file'), this.fileController.uploadFile.bind(this.fileController));
        this.router.get('/download/:id', this.fileController.downloadFile.bind(this.fileController));
    }
}