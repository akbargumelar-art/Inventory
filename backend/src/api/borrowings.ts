// FIXED: File ini telah diperbaiki untuk mengatasi error build TypeScript.
import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET all borrowings
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const borrowings = await prisma.borrowing.findMany({ orderBy: { borrowDate: 'desc' }});
        res.json(borrowings);
    } catch (error) {
        const err = error as Error;
        console.error("Error fetching borrowings: ", err);
        res.status(500).json({ message: 'Error fetching borrowings', error: err.message });
    }
});

// POST a new borrowing
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { itemId, borrowerName, borrowDate, expectedReturnDate, notes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        let newHistory;
        const result = await prisma.$transaction(async (tx) => {
            const updatedItem = await tx.item.update({
                where: { id: itemId },
                data: { stock: { decrement: 1 } },
            });

            if (updatedItem.stock < 0) {
                throw new Error("Stok tidak mencukupi.");
            }

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

            return { borrowing, updatedItem };
        });
        
        const { borrowing, updatedItem } = result;
        res.status(201).json({ newBorrowing: borrowing, newHistory, updatedItem: {...updatedItem, media: []} });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error creating borrowing record', error: err.message });
    }
});

// PUT to return a borrowing
router.put('/:id/return', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        let newHistory;
        const result = await prisma.$transaction(async (tx) => {
            const borrowing = await tx.borrowing.findUnique({ where: { id } });
            if (!borrowing || borrowing.status === 'Kembali') {
                throw new Error("Borrowing record not found or already returned.");
            }

            const updatedItem = await tx.item.update({
                where: { id: borrowing.itemId },
                data: { stock: { increment: 1 } },
            });

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

            const updatedBorrowing = await tx.borrowing.update({
                where: { id },
                data: {
                    status: 'Kembali',
                    actualReturnDate: new Date(),
                },
            });

            return { updatedBorrowing, updatedItem };
        });

        const { updatedBorrowing, updatedItem } = result;
        res.json({ updatedBorrowing, newHistory, updatedItem: {...updatedItem, media: []} });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error returning item', error: err.message });
    }
});

export default router;
