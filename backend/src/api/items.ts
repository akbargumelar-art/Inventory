
// Fix: Separated express import from type imports to resolve type conflicts.
import express from 'express';
import type { Response } from 'express';
// Fix: Use `require` for PrismaClient to avoid potential ESM/CJS module resolution issues.
const { PrismaClient } = require('@prisma/client');
import { authMiddleware, AuthRequest, authorize } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all items - accessible by all authenticated users
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const items = await prisma.item.findMany({ 
            // include: { media: true },
            orderBy: { createdAt: 'desc' }
        });
        // FIXED: Return empty media array for now as media upload is not implemented.
        res.json(items.map(item => ({...item, media: []}))); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// POST a new item - Administrator & Input Data
router.post('/', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
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

// PUT to update an item - Administrator & Input Data
router.put('/:id', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
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

// DELETE an item - Administrator only
router.delete('/:id', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: Response) => {
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

// POST to adjust stock - Administrator & Input Data
router.post('/:id/adjust', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { quantityChange, type, reason } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        let newHistory;
        const updatedItem = await prisma.$transaction(async (tx) => {
            const item = await tx.item.update({
                where: { id },
                data: {
                    stock: {
                        increment: quantityChange
                    }
                }
            });

            newHistory = await tx.stockHistory.create({
                data: {
                    itemId: id,
                    userId,
                    quantityChange,
                    type,
                    reason,
                },
                include: { user: { select: { id: true, name: true, email: true, role: true }}, item: { select: { id: true, name: true, sku: true }} }
            });

            return item;
        });

        // FIXED: Return both the updated item and the new history record.
        res.json({ updatedItem: {...updatedItem, media: []}, newHistory });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error adjusting stock', error: err.message });
    }
});

export default router;