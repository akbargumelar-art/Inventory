
import express, { Response } from 'express';
const { PrismaClient } = require('@prisma/client');
import { authMiddleware, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all categories
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

// POST a new category
router.post('/', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
    const { name, parentId } = req.body;
    try {
        const newCategory = await prisma.category.create({
            data: { name, parentId },
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
});

// PUT to update a category
router.put('/:id', authMiddleware, authorize(['Administrator', 'Input Data']), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, parentId } = req.body;
    try {
        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, parentId },
        });
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
});

// DELETE a category
router.delete('/:id', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
});

export default router;