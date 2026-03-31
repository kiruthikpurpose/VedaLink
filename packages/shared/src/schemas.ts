import { z } from 'zod';

export const RoleEnum = z.enum(["FARMER", "BUYER", "EXPORTER", "LOGISTICS", "PACKHOUSE", "ADMIN"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: RoleEnum,
  createdAt: z.date()
});

export const CreateBatchSchema = z.object({
  farmerId: z.string().uuid(),
  cropType: z.string(),
  quantityKg: z.number().positive(),
  harvestDate: z.string(), // ISO string date
});

export const OrderSchema = z.object({
  batchId: z.string().uuid(),
  buyerId: z.string().uuid(),
  price: z.number().positive(),
});

export const EscrowLockSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().positive(),
});

export const AiGradeResultSchema = z.object({
  grade: z.string(),
  confidence: z.number().min(0).max(1),
  defectTags: z.array(z.string()),
});
