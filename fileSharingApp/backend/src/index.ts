import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes';
import authRoutes from './routes/authRoutes';
import statsRoutes from './routes/statsRoutes';
import { startCleanupService } from './services/cleanupService';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/stats', statsRoutes);

startCleanupService();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});