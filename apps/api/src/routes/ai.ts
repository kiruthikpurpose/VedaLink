import { Router } from 'express';
import { PrismaClient } from '@vedalink/shared';

const router = Router();
const prisma = new PrismaClient();

// Mock function to simulate AI grading inference delay and result
const simulateAiGrading = async () => {
  return new Promise<{ grade: string, confidence: number, defectTags: string[] }>((resolve) => {
    setTimeout(() => {
      const grades = ['A (Export Quality)', 'B (Domestic Premium)', 'C (Standard)'];
      const randomGrade = grades[Math.floor(Math.random() * grades.length)];
      
      const defectsPool = ['Bruised', 'Underripe', 'Overripe', 'Fungal Spot', 'Clean'];
      // Pick 0 to 2 random defects
      const numDefects = Math.floor(Math.random() * 3);
      const randomDefects: string[] = [];
      if (randomGrade.startsWith('A')) {
        randomDefects.push('Clean');
      } else {
        for (let i = 0; i < numDefects; i++) {
          randomDefects.push(defectsPool[Math.floor(Math.random() * (defectsPool.length - 1))]);
        }
      }

      resolve({
        grade: randomGrade,
        confidence: 0.85 + Math.random() * 0.14, // 85% to 99%
        defectTags: [...new Set(randomDefects)] // unique tags
      });
    }, 2000); // 2 second delay to simulate inference
  });
};

router.post('/grade/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    
    // Validate batch exists
    const batch = await prisma.batch.findUnique({ where: { id: batchId } });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    if (batch.status !== 'CREATED') {
      return res.status(400).json({ error: 'Batch already graded or not in CREATED state' });
    }

    // "Run" AI model
    const mockResult = await simulateAiGrading();

    // Update batch in DB
    const updatedBatch = await prisma.batch.update({
      where: { id: batchId },
      data: {
        aiGrade: mockResult.grade,
        aiConfidence: mockResult.confidence,
        defectTags: mockResult.defectTags,
        status: 'GRADED',
      }
    });

    res.json({
      message: 'AI grading completed',
      result: mockResult,
      batch: updatedBatch
    });
  } catch (error) {
    console.error('Error in AI grading:', error);
    res.status(500).json({ error: 'Internal server error during AI inference' });
  }
});

export const aiRouter = router;
