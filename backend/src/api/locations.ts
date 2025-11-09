// Fix: Separate default and type imports for express to resolve type conflicts.
import express from 'express';
import type { Response } from 'express';
// Fix: Use `require` for PrismaClient to avoid potential ESM/CJS module resolution issues.
const { PrismaClient } = require('@prisma/client');
import { authMiddleware, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all locations
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const locations = await prisma.location.findMany({ orderBy: { name: 'asc' }});
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching locations', error });
    }
});

// POST a new location
router.post('/', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
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
router.put('/:id', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
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
router.delete('/:id', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.location.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting location', error });
    }
});

export default router;