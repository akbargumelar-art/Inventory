import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET all items
router.get('/', authMiddleware, async (req, res) => {
    try {
        const items = await prisma.item.findMany({ 
            include: { media: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// POST a new item
router.post('/', authMiddleware, async (req, res) => {
    const { media, ...itemData } = req.body;
    try {
        const newItem = await prisma.item.create({
            data: {
                ...itemData,
                sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                barcode: Math.random().toString().slice(2, 14),
                // media: media ? { create: media } : undefined
            },
            // include: { media: true }
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
});

// PUT to update an item
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { media, ...itemData } = req.body;
    try {
        const updatedItem = await prisma.item.update({
            where: { id },
            data: {
                ...itemData,
                // logic to update media would be more complex (delete old, create new)
            },
            // include: { media: true }
        });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
});

// DELETE an item
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.item.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
});

// POST to adjust stock
router.post('/:id/adjust', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { quantityChange, type, reason } = req.body;
    const userId = (req as any).user.userId;

    try {
        const updatedItem = await prisma.$transaction(async (tx) => {
            const item = await tx.item.update({
                where: { id },
                data: {
                    stock: {
                        increment: quantityChange
                    }
                }
            });

            await tx.stockHistory.create({
                data: {
                    itemId: id,
                    userId,
                    quantityChange,
                    type,
                    reason,
                }
            });

            return item;
        });

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adjusting stock', error });
    }
});

export default router;
