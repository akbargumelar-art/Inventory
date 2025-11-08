// Fix: Use ES module import for Express.
import express, { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all borrowings
// Fix: Added types for req and res.
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const borrowings = await prisma.borrowing.findMany({ orderBy: { borrowDate: 'desc' }});
        res.json(borrowings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching borrowings', error });
    }
});

// POST a new borrowing
// Fix: Added type for req.
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { itemId, borrowerName, borrowDate, expectedReturnDate, notes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const newBorrowing = await prisma.$transaction(async (tx) => {
            // Decrease stock
            await tx.item.update({
                where: { id: itemId },
                data: { stock: { decrement: 1 } },
            });

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
            await tx.stockHistory.create({
                data: {
                    itemId: itemId,
                    userId: userId,
                    quantityChange: -1,
                    type: 'Dipinjamkan',
                    reason: `Dipinjam oleh ${borrowerName}`,
                }
            });

            return borrowing;
        });
        res.status(201).json(newBorrowing);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error creating borrowing record', error: err.message });
    }
});

// PUT to return a borrowing
// Fix: Added types for req and res.
router.put('/:id/return', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const updatedBorrowing = await prisma.$transaction(async (tx) => {
            const borrowing = await tx.borrowing.findUnique({ where: { id } });
            if (!borrowing || borrowing.status === 'Kembali') {
                throw new Error("Borrowing record not found or already returned.");
            }

            // Increase stock
            await tx.item.update({
                where: { id: borrowing.itemId },
                data: { stock: { increment: 1 } },
            });

            // Create stock history record
            await tx.stockHistory.create({
                data: {
                    itemId: borrowing.itemId,
                    userId,
                    quantityChange: 1,
                    type: 'Dikembalikan',
                    reason: `Dikembalikan oleh ${borrowing.borrowerName}`,
                }
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
        res.json(updatedBorrowing);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error returning item', error: err.message });
    }
});


export default router;