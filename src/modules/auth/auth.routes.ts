import { Router } from 'express';
import { register } from './register.controller';
import { login } from './login.controller';
import { getMe } from './getMe.controller';
import { verifyOtp } from './verifyOtp.controller';
import { resendOtp } from './resendOtp.controller';
import { forgotPassword } from './forgotPassword.controller';
import { resetPassword } from './resetPassword.controller';
import { refreshToken } from './refreshToken.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

// Authentication Routes
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/me', verifyToken, getMe);

export const AuthRoutes = router;
export default router;

