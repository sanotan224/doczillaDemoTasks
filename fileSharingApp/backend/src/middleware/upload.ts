import multer, {FileFilterCallback} from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';

const uploadDir = path.join(__dirname, '../../../uploads');

fs.ensureDir(uploadDir).catch(console.error);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback): void => {
    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});