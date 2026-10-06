import { Router } from 'express';
import { register } from './register.controller';
import { login } from './login.controller';
import { getMe } from './getMe.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

// Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

export const AuthRoutes = router;
export default router;
