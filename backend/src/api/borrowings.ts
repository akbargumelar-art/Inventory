// Fix: Use standard imports for Express and Prisma to resolve type errors.
import express from 'express';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
// Fix: Use `import type` for Prisma types to resolve module resolution issues.
import type { Prisma, Item } from '@prisma/client';
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
        let newHistory;
        let updatedItem: Item | undefined;
        const newBorrowing = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Decrease stock
            updatedItem = await tx.item.update({
                where: { id: itemId },
                data: { stock: { decrement: 1 } },
            });

            if (updatedItem.stock < 0) {
                throw new Error("Stok tidak mencukupi.");
            }

            // Create borrowing record
            const borrowing = await tx.borrowing.create({
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
            newHistory = await tx.stockHistory.create({
                data: {
                    itemId: itemId,
                    userId: userId,
                    quantityChange: -1,
                    type: 'Dipinjamkan',
                    reason: `Dipinjam oleh ${borrowerName}`,
                },
                 include: { user: { select: { id: true, name: true, email: true, role: true }}, item: { select: { id: true, name: true, sku: true }} }
            });

            return borrowing;
        });
        res.status(201).json({ newBorrowing, newHistory, updatedItem: updatedItem ? {...updatedItem, media: []} : undefined });
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
        let newHistory;
        let updatedItem: Item | undefined;
        const updatedBorrowing = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const borrowing = await tx.borrowing.findUnique({ where: { id } });
            if (!borrowing || borrowing.status === 'Kembali') {
                throw new Error("Borrowing record not found or already returned.");
            }

            // Increase stock
            updatedItem = await tx.item.update({
                where: { id: borrowing.itemId },
                data: { stock: { increment: 1 } },
            });

            // Create stock history record
            newHistory = await tx.stockHistory.create({
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
            return tx.borrowing.update({
                where: { id },
                data: {
                    status: 'Kembali',
                    actualReturnDate: new Date(),
                },
            });
        });
        res.json({ updatedBorrowing, newHistory, updatedItem: updatedItem ? {...updatedItem, media: []} : undefined });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error returning item', error: err.message });
    }
});


export default router;