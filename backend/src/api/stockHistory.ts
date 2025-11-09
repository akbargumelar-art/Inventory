// Fix: Use standard imports for Express and Prisma to resolve type errors.
import express from 'express';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
// Fix: Use `import type` for Prisma types to resolve module resolution issues.
import type { StockHistory, User } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all stock history
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
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
        
        type HistoryRecord = StockHistory & {
            user: Partial<User>;
            item: { id: string; name: string; sku: string; };
        };

        // Map to frontend-compatible structure
        const formattedHistory = history.map((h: HistoryRecord) => ({
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