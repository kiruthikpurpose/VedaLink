"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// In-memory mock notification queue
const mockNotifications = [
    { id: 1, type: 'ESCROW_LOCKED', message: "Global Fresh locked ₹ 55,000 in escrow for Batch B-9281A", read: false, time: new Date() },
    { id: 2, type: 'AI_GRADE_CERT', message: "Batch B-9281A achieved Export Grade A.", read: false, time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 3, type: 'LOGISTICS_READY', message: "ColdChain Truck arrived at Nashik Packhouse.", read: true, time: new Date(Date.now() - 1000 * 60 * 60 * 24) }
];
router.get('/', (req, res) => {
    res.json(mockNotifications);
});
router.post('/mark-read', (req, res) => {
    mockNotifications.forEach(n => n.read = true);
    res.json({ success: true, count: mockNotifications.length });
});
exports.default = router;
