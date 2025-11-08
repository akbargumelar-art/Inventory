// Fix: Use ES module import for Express.
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all stock history
// Fix: Added types for req and res.
// Fix: Used express.Response to avoid type conflicts.
router.get('/', authMiddleware, async (req: AuthRequest, res: express.Response) => {
    try {
        const history = await prisma.stockHistory.findMany({
            orderBy: { timestamp: 'desc' },
            take: 20, // Limit to recent 20 activities
            include: {
                user: {
                    select: { id: true, name: true, email: true, role: true }
                },
                item: {
                    select: { id: true, name: true, sku: true }
                }
            }
        });
        
        // Map to frontend-compatible structure
        const formattedHistory = history.map(h => ({
            id: h.id,
            timestamp: h.timestamp.toISOString(),
            user: h.user,
            type: h.type,
            quantityChange: h.quantityChange,
            fromLocation: null, // Placeholder, as location is not tracked in this model
            toLocation: null, // Placeholder
            reason: h.reason,
            relatedItem: h.item
        }));

        res.json(formattedHistory);
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Error fetching stock history', error: err.message });
    }
});

export default router;