import { z } from 'zod';
export declare const RoleEnum: z.ZodEnum<["FARMER", "BUYER", "EXPORTER", "LOGISTICS", "PACKHOUSE", "ADMIN"]>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<["FARMER", "BUYER", "EXPORTER", "LOGISTICS", "PACKHOUSE", "ADMIN"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    role: "FARMER" | "BUYER" | "EXPORTER" | "LOGISTICS" | "PACKHOUSE" | "ADMIN";
    createdAt: Date;
}, {
    id: string;
    email: string;
    name: string;
    role: "FARMER" | "BUYER" | "EXPORTER" | "LOGISTICS" | "PACKHOUSE" | "ADMIN";
    createdAt: Date;
}>;
export declare const CreateBatchSchema: z.ZodObject<{
    farmerId: z.ZodString;
    cropType: z.ZodString;
    quantityKg: z.ZodNumber;
    harvestDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    farmerId: string;
    cropType: string;
    quantityKg: number;
    harvestDate: string;
}, {
    farmerId: string;
    cropType: string;
    quantityKg: number;
    harvestDate: string;
}>;
export declare const OrderSchema: z.ZodObject<{
    batchId: z.ZodString;
    buyerId: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    batchId: string;
    buyerId: string;
    price: number;
}, {
    batchId: string;
    buyerId: string;
    price: number;
}>;
export declare const EscrowLockSchema: z.ZodObject<{
    orderId: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    amount: number;
}, {
    orderId: string;
    amount: number;
}>;
export declare const AiGradeResultSchema: z.ZodObject<{
    grade: z.ZodString;
    confidence: z.ZodNumber;
    defectTags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    grade: string;
    confidence: number;
    defectTags: string[];
}, {
    grade: string;
    confidence: number;
    defectTags: string[];
}>;
