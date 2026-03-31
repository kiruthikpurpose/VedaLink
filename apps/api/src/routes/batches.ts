import { Router } from 'express';
import { PrismaClient } from '@vedalink/shared';

const router = Router();
const prisma = new PrismaClient();

// Get all batches (with optional filters)
router.get('/', async (req, res) => {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        farmer: {
          select: { name: true, farmerProfile: true }
        },
        logisticsEvents: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single batch by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        farmer: {
          select: { name: true, farmerProfile: true }
        },
        logisticsEvents: {
          orderBy: { timestamp: 'desc' }
        },
        exportPassport: true
      }
    });
    
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    
    res.json(batch);
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new batch
router.post('/', async (req, res) => {
  try {
    const { farmerId, cropType, quantityKg, harvestDate } = req.body;
    
    // In a real app we'd validate with Zod schema here
    if (!farmerId || !cropType || !quantityKg || !harvestDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const batch = await prisma.batch.create({
      data: {
        farmerId,
        cropType,
        quantityKg: parseFloat(quantityKg),
        harvestDate: new Date(harvestDate),
        status: 'CREATED',
        qrCodeUrl: `https://vedalink.app/batch/${Date.now()}` // Mock QR url
      }
    });
    
    res.status(201).json(batch);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const batchRouter = router;
