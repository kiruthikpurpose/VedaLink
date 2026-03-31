"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const shared_1 = require("@vedalink/shared");
const router = (0, express_1.Router)();
const prisma = new shared_1.PrismaClient();
// Mock Auth: Returns user or creates one based on email
router.post('/login', async (req, res) => {
    const { email, role, name } = req.body;
    if (!email || !role || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    role,
                }
            });
        }
        // Usually we would sign a JWT here. For demo purposes we can just return the user object
        res.json({ user, token: `mock_jwt_for_${user.id}` });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
});
exports.authRouter = router;
