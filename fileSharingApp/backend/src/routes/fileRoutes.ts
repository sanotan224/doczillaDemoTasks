import { Router } from 'express';
import { uploadFile, downloadFile} from '../controllers/fileController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/download/:id', downloadFile);

export default router;