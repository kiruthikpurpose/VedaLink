"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escrowRouter = void 0;
const express_1 = require("express");
const shared_1 = require("@vedalink/shared");
const router = (0, express_1.Router)();
const prisma = new shared_1.PrismaClient();
// Create an Order and Lock Escrow
router.post('/create', async (req, res) => {
    try {
        const { batchId, buyerId, price } = req.body;
        if (!batchId || !buyerId || !price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Create Order and EscrowTransaction atomically
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    batchId,
                    buyerId,
                    price: parseFloat(price),
                    status: 'PENDING',
                }
            });
            await tx.escrowTransaction.create({
                data: {
                    orderId: newOrder.id,
                    amount: parseFloat(price),
                    status: 'LOCKED'
                }
            });
            return newOrder;
        });
        res.status(201).json({ message: 'Order created and escrow locked', order });
    }
    catch (error) {
        console.error('Error creating order/escrow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Release Escrow (upon verified delivery)
router.post('/release/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const escrow = await prisma.escrowTransaction.findUnique({ where: { orderId } });
        if (!escrow)
            return res.status(404).json({ error: 'Escrow not found for order' });
        if (escrow.status !== 'LOCKED') {
            return res.status(400).json({ error: 'Escrow is not locked' });
        }
        // Release funds and update order status
        await prisma.$transaction(async (tx) => {
            await tx.escrowTransaction.update({
                where: { id: escrow.id },
                data: { status: 'RELEASED' }
            });
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'COMPLETED' }
            });
        });
        res.json({ message: 'Escrow released and order completed' });
    }
    catch (error) {
        console.error('Error releasing escrow:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.escrowRouter = router;
