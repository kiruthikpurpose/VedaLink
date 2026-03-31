"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiGradeResultSchema = exports.EscrowLockSchema = exports.OrderSchema = exports.CreateBatchSchema = exports.UserSchema = exports.RoleEnum = void 0;
const zod_1 = require("zod");
exports.RoleEnum = zod_1.z.enum(["FARMER", "BUYER", "EXPORTER", "LOGISTICS", "PACKHOUSE", "ADMIN"]);
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
    role: exports.RoleEnum,
    createdAt: zod_1.z.date()
});
exports.CreateBatchSchema = zod_1.z.object({
    farmerId: zod_1.z.string().uuid(),
    cropType: zod_1.z.string(),
    quantityKg: zod_1.z.number().positive(),
    harvestDate: zod_1.z.string(), // ISO string date
});
exports.OrderSchema = zod_1.z.object({
    batchId: zod_1.z.string().uuid(),
    buyerId: zod_1.z.string().uuid(),
    price: zod_1.z.number().positive(),
});
exports.EscrowLockSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive(),
});
exports.AiGradeResultSchema = zod_1.z.object({
    grade: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
    defectTags: zod_1.z.array(zod_1.z.string()),
});
