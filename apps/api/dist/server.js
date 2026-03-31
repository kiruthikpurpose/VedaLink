"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const prisma = new client_1.PrismaClient();
const auth_1 = require("./routes/auth");
const batches_1 = require("./routes/batches");
const ai_1 = require("./routes/ai");
const escrow_1 = require("./routes/escrow");
const logistics_1 = require("./routes/logistics");
const notifications_1 = __importDefault(require("./routes/notifications"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_1.authRouter);
app.use('/batches', batches_1.batchRouter);
app.use('/ai', ai_1.aiRouter);
app.use('/escrow', escrow_1.escrowRouter);
app.use('/logistics', logistics_1.logisticsRouter);
app.use('/notifications', notifications_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// We will add more routes here corresponding to feature requirements
app.listen(port, () => {
    console.log(`VedaLink API server running on port ${port}`);
});
