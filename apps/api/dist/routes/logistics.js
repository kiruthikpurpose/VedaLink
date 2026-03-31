"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logisticsRouter = void 0;
const express_1 = require("express");
const shared_1 = require("@vedalink/shared");
const router = (0, express_1.Router)();
const prisma = new shared_1.PrismaClient();
// Add logistics tracking event
router.post('/event', async (req, res) => {
    try {
        const { batchId, location, temperature, handler } = req.body;
        if (!batchId || !location) {
            return res.status(400).json({ error: 'BatchId and Location are required' });
        }
        const event = await prisma.logisticsEvent.create({
            data: {
                batchId,
                location,
                temperature: temperature ? parseFloat(temperature) : null,
                handler: handler || null
            }
        });
        // Optionally update batch status
        await prisma.batch.update({
            where: { id: batchId },
            data: { status: 'IN_TRANSIT' }
        });
        res.status(201).json({ message: 'Logistics event recorded', event });
    }
    catch (error) {
        console.error('Error creating logistics event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Update export compliance passport status
router.post('/passport/generate/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;
        const { destination, isCompliant } = req.body;
        const passport = await prisma.exportPassport.upsert({
            where: { batchId },
            update: {
                destination,
                isCompliant: isCompliant === true,
                documents: ['https://vedalink.app/docs/phyto.pdf'] // Mock doc
            },
            create: {
                batchId,
                destination,
                isCompliant: isCompliant === true,
                documents: ['https://vedalink.app/docs/phyto.pdf']
            }
        });
        res.json({ message: 'Export passport generated/updated', passport });
    }
    catch (error) {
        console.error('Error generating passport:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.logisticsRouter = router;
