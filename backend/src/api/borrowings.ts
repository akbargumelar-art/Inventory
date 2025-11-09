import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest, authorize } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all borrowings
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const borrowings = await prisma.borrowing.findMany({ orderBy: { borrowDate: 'desc' }});
        res.json(borrowings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching borrowings', error });
    }
});

// POST a new borrowing
router.post('/', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
    const { itemId, borrowerName, borrowDate, expectedReturnDate, notes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Decrease stock
            const updatedItem = await tx.item.update({
                where: { id: itemId },
                data: { stock: { decrement: 1 } },
            });

            if (updatedItem.stock < 0) {
                throw new Error("Stok tidak mencukupi.");
            }

            // Create borrowing record
            const newBorrowing = await tx.borrowing.create({
                data: {
                    itemId,
                    userId,
                    borrowerName,
                    borrowDate,
                    expectedReturnDate,
                    notes,
                },
            });
            // Create stock history record
            const newHistory = await tx.stockHistory.create({
                data: {
                    itemId: itemId,
                    userId: userId,
                    quantityChange: -1,
                    type: 'Dipinjamkan',
                    reason: `Dipinjam oleh ${borrowerName}`,
                },
                 include: { user: { select: { id: true, name: true, email: true, role: true }}, item: { select: { id: true, name: true, sku: true }} }
            });

            return { newBorrowing, newHistory, updatedItem };
        });
        res.status(201).json({ newBorrowing: result.newBorrowing, newHistory: result.newHistory, updatedItem: { ...result.updatedItem, media: [] } });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error creating borrowing record', error: err.message });
    }
});

// PUT to return a borrowing
router.put('/:id/return', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const borrowing = await tx.borrowing.findUnique({ where: { id } });
            if (!borrowing || borrowing.status === 'Kembali') {
                throw new Error("Borrowing record not found or already returned.");
            }

            // Increase stock
            const updatedItem = await tx.item.update({
                where: { id: borrowing.itemId },
                data: { stock: { increment: 1 } },
            });

            // Create stock history record
            const newHistory = await tx.stockHistory.create({
                data: {
                    itemId: borrowing.itemId,
                    userId,
                    quantityChange: 1,
                    type: 'Dikembalikan',
                    reason: `Dikembalikan oleh ${borrowing.borrowerName}`,
                },
                include: { user: { select: { id: true, name: true, email: true, role: true }}, item: { select: { id: true, name: true, sku: true }} }
            });

            // Update borrowing status
            const updatedBorrowing = await tx.borrowing.update({
                where: { id },
                data: {
                    status: 'Kembali',
                    actualReturnDate: new Date(),
                },
            });
            
            return { updatedBorrowing, newHistory, updatedItem };
        });
        res.json({ updatedBorrowing: result.updatedBorrowing, newHistory: result.newHistory, updatedItem: { ...result.updatedItem, media: [] } });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error returning item', error: err.message });
    }
});


export default router;