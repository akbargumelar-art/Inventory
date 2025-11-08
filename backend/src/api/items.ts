// Fix: Use require for Express to ensure correct type resolution.
import express = require('express');
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all items
router.get('/', authMiddleware, async (req, res) => {
    try {
        const items = await prisma.item.findMany({ 
            // include: { media: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(items.map(item => ({...item, media: []}))); // Return empty media array for now
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// POST a new item
router.post('/', authMiddleware, async (req, res) => {
    const { ...itemData } = req.body;
    // active field is replaced by status
    delete itemData.active;
     // remove id if it's sent for creation
    delete itemData.id;
    try {
        const newItem = await prisma.item.create({
            data: {
                ...itemData,
                price: Number(itemData.price) || 0,
                stock: Number(itemData.stock) || 0,
                minStock: Number(itemData.minStock) || 0,
                sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                barcode: Math.random().toString().slice(2, 14),
            },
        });
        res.status(201).json({...newItem, media: []});
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error creating item', error: err.message });
    }
});

// PUT to update an item
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { ...itemData } = req.body;
     // remove fields that shouldn't be updated directly
    delete itemData.id;
    delete itemData.sku;
    delete itemData.barcode;
    delete itemData.createdAt;
    
    try {
        const updatedItem = await prisma.item.update({
            where: { id },
            data: {
                ...itemData,
                price: Number(itemData.price) || 0,
                stock: Number(itemData.stock) || 0,
                minStock: Number(itemData.minStock) || 0,
            },
        });
        res.json({...updatedItem, media: []});
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error updating item', error: err.message });
    }
});

// DELETE an item
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // In a real app, you might need to handle related records first
        await prisma.item.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error deleting item', error: err.message });
    }
});

// POST to adjust stock
router.post('/:id/adjust', authMiddleware, async (req: AuthRequest, res: express.Response) => {
    const { id } = req.params;
    const { quantityChange, type, reason } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

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

        res.json({...updatedItem, media: []});
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error adjusting stock', error: err.message });
    }
});

export default router;