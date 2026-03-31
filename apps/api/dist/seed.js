"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Clearing database...');
    await prisma.exportPassport.deleteMany();
    await prisma.logisticsEvent.deleteMany();
    await prisma.escrowTransaction.deleteMany();
    await prisma.order.deleteMany();
    await prisma.batch.deleteMany();
    await prisma.farmerProfile.deleteMany();
    await prisma.user.deleteMany();
    console.log('Seeding demo data...');
    // Create Users
    const farmer = await prisma.user.create({
        data: {
            email: 'farmer@vedalink.app',
            name: 'Ramesh Kumar',
            role: client_1.Role.FARMER,
            password: 'password123',
            farmerProfile: {
                create: {
                    farmName: 'Ramesh Vineyards',
                    location: 'Nashik, Maharashtra',
                    totalAreaAcres: 12.5,
                }
            }
        }
    });
    const buyer = await prisma.user.create({
        data: {
            email: 'buyer@vedalink.app',
            name: 'Global Fresh Imports',
            role: client_1.Role.BUYER,
            password: 'password123'
        }
    });
    const exporter = await prisma.user.create({
        data: {
            email: 'exporter@vedalink.app',
            name: 'India Agri Exports Ltd',
            role: client_1.Role.EXPORTER,
            password: 'password123'
        }
    });
    const logistics = await prisma.user.create({
        data: {
            email: 'logistics@vedalink.app',
            name: 'ColdChain Express',
            role: client_1.Role.LOGISTICS,
            password: 'password123'
        }
    });
    // Create Batches
    const batch1 = await prisma.batch.create({
        data: {
            farmerId: farmer.id,
            cropType: 'Export Grapes (Thompson Seedless)',
            quantityKg: 500,
            harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: 'GRADED',
            qrCodeUrl: 'https://vedalink.app/verify/B-9281A',
            aiGrade: 'A (Export Quality)',
            aiConfidence: 0.98,
            defectTags: ['Clean', 'Optimal Size'],
        }
    });
    const batch2 = await prisma.batch.create({
        data: {
            farmerId: farmer.id,
            cropType: 'Pomegranates (Bhagwa)',
            quantityKg: 300,
            harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            status: 'CREATED',
            qrCodeUrl: 'https://vedalink.app/verify/B-9282B',
        }
    });
    // Create Order and Escrow for Batch 1
    const order = await prisma.order.create({
        data: {
            batchId: batch1.id,
            buyerId: buyer.id,
            price: 55000, // 55,000 INR
            status: 'SHIPPED',
            escrow: {
                create: {
                    amount: 55000,
                    status: 'LOCKED'
                }
            }
        }
    });
    await prisma.batch.update({
        where: { id: batch1.id },
        data: { status: 'IN_TRANSIT' }
    });
    // Create Logistics Events for Batch 1
    await prisma.logisticsEvent.create({
        data: {
            batchId: batch1.id,
            location: 'Nashik Packhouse',
            temperature: 4.2,
            handler: exporter.id,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        }
    });
    await prisma.logisticsEvent.create({
        data: {
            batchId: batch1.id,
            location: 'Mumbai Port Hub',
            temperature: 4.5,
            handler: logistics.id,
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        }
    });
    // Create Passport for Batch 1
    await prisma.exportPassport.create({
        data: {
            batchId: batch1.id,
            destination: 'Rotterdam, Netherlands',
            isCompliant: true,
            documents: [
                'https://vedalink.app/docs/globalgap_cert.pdf',
                'https://vedalink.app/docs/phyto_b9281a.pdf'
            ]
        }
    });
    console.log('Seed completed successfully. Users created:');
    console.log('Farmer:', farmer.email);
    console.log('Buyer:', buyer.email);
    console.log('Exporter:', exporter.email);
    console.log('Logistics:', logistics.email);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
