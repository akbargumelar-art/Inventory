import express, { Response } from 'express';
// Fix: Use namespace import for Prisma Client to resolve module issues.
import * as Prisma from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new Prisma.PrismaClient();

// GET current user's profile
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, username: true, email: true, role: true }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

// PUT to update current user's profile
router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { name, email, password } = req.body; // username is not updatable from profile

    let dataToUpdate: any = { name, email };
    if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
            select: { id: true, name: true, username: true, email: true, role: true }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
});

export default router;