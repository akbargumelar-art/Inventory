// Fix: Use default import for express to avoid type conflicts with global Response type.
// FIX: import Response type from express
import express, { Response } from 'express';
// Fix: Use `require` for PrismaClient to avoid potential ESM/CJS module resolution issues.
const { PrismaClient } = require('@prisma/client');
import { authMiddleware, authorize, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

// GET all users
// FIX: use imported Response type
router.get('/', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
            orderBy: { name: 'asc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// POST a new user
// FIX: use imported Response type
router.post('/', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: Response) => {
    const { name, username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = await prisma.user.create({
            data: { name, username, email, password: hashedPassword, role },
            select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

// PUT to update a user
// FIX: use imported Response type
router.put('/:id', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, username, email, role, password } = req.body;
    
    let data: any = { name, username, email, role };
    if (password) {
        data.password = await bcrypt.hash(password, 10);
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// DELETE a user
// FIX: use imported Response type
router.delete('/:id', authMiddleware, authorize(['Administrator']), async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

export default router;