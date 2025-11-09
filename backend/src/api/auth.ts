import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("FATAL: JWT_SECRET is not defined in the environment variables.");
        throw new Error("JWT_SECRET is not configured on the server.");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });

  } catch (error) {
    // SUPER DETAILED LOGGING FOR FINAL DIAGNOSIS
    console.error("========================================");
    console.error("FATAL ERROR DURING LOGIN PROCESS:");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Request Body:", { username: req.body.username, password: '[REDACTED]' }); // Redact password from logs
    console.error("Full Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error("========================================");
    
    const err = error as Error;
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

export default router;