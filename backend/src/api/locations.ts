
import express from 'express';
// Fix: Use direct import for PrismaClient to resolve module issues.
import { PrismaClient } from '@prisma/client';
import { authMiddleware, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all locations
// Fix: Use express.Response for correct type.
router.get('/', authMiddleware, async (req: AuthRequest, res: express.Response) => {
    try {
        const locations = await prisma.location.findMany({ orderBy: { name: 'asc' }});
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});

// POST a new location
// Fix: Use express.Response for correct type.
router.post('/', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: express.Response) => {
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
// Fix: Use express.Response for correct type.
router.put('/:id', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: express.Response) => {
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
// Fix: Use express.Response for correct type.
router.delete('/:id', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: express.Response) => {
    const { id } = req.params;
    try {
        await prisma.location.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting location', error });
    }
});

export default router;