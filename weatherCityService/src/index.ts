import express from 'express';
import cors from 'cors';
import weatherRoutes from "./routes/weatherRoutes";

const index = express();
const PORT = 3000;

index.use(cors());
index.use(express.json());
index.use(express.urlencoded({ extended: true }));

index.use('/weather', weatherRoutes)

index.listen(PORT);