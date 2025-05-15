import { Router } from 'express';
import { analizarSentimientos, generarReporte } from '../services/openai';

const router = Router();

// POST /analisis/sentimiento { texto }
router.post('/sentimiento', async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ message: 'Falta texto' });
    const sentimiento = await analizarSentimientos(texto);
    res.json({ sentimiento });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al analizar sentimiento' });
  }
});

// POST /analisis/reporte { datos }
router.post('/reporte', async (req, res) => {
  try {
    const { datos } = req.body;
    if (!datos) return res.status(400).json({ message: 'Falta datos' });
    const reporte = await generarReporte(datos);
    res.json({ reporte });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar reporte' });
  }
});

export default router;
