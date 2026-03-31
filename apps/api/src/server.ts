import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();

import { authRouter } from './routes/auth';
import { batchRouter } from './routes/batches';
import { aiRouter } from './routes/ai';
import { escrowRouter } from './routes/escrow';
import { logisticsRouter } from './routes/logistics';
import notificationRouter from './routes/notifications';

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/batches', batchRouter);
app.use('/ai', aiRouter);
app.use('/escrow', escrowRouter);
app.use('/logistics', logisticsRouter);
app.use('/notifications', notificationRouter);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// We will add more routes here corresponding to feature requirements

app.listen(port, () => {
  console.log(`VedaLink API server running on port ${port}`);
});
