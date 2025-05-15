import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import creditosRouter from './routes/creditos';
import authRouter from './routes/auth';
import analisisRouter from './routes/analisis';
import planesRouter from './routes/planes';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const app = express();
app.use(cors({
  origin: '*', // Permite cualquier origen en desarrollo
  credentials: true
}));
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.get('/', (_req, res) => res.json({
  name: 'Reputacion Online API',
  status: 'running',
  version: '1.0.0',
}));

app.use('/api/creditos', creditosRouter);
app.use('/api/auth', authRouter);
app.use('/api/analisis', analisisRouter);
app.use('/api/planes', planesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
