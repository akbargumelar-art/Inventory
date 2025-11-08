// Fix: Use require for Express to ensure correct type resolution.
import express = require('express');
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET all categories
router.get('/', authMiddleware, async (req, res) => {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

// POST a new category
router.post('/', authMiddleware, async (req, res) => {
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
router.put('/:id', authMiddleware, async (req, res) => {
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
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
});

export default router;