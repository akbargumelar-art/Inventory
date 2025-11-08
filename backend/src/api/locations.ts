// Fix: Use ES module import for Express.
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all locations
// Fix: Added types for req and res.
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const locations = await prisma.location.findMany({ orderBy: { name: 'asc' }});
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});

// POST a new location
// Fix: Added types for req and res.
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    const { name, code, address, description } = req.body;
    try {
        const newLocation = await prisma.location.create({
            data: { name, code, address, description },
        });
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating location', error });
    }
});

// PUT to update a location
// Fix: Added types for req and res.
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, code, address, description } = req.body;
    try {
        const updatedLocation = await prisma.location.update({
            where: { id },
            data: { name, code, address, description },
        });
        res.json(updatedLocation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error });
    }
});

// DELETE a location
// Fix: Added types for req and res.
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.location.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting location', error });
    }
});

export default router;