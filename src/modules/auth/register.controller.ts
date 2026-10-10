import crypto from 'crypto';
import { Request, Response } from 'express';
import { Role, UserStatus } from '@prisma/client';
import prisma from '../../config/prismaClient';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { hashPassword } from '../../utils/auth';
import sendEmail from '../../utils/sendEmail';
import { saveOtp, deleteOtp } from '../../utils/otp';

/**
 * Register a new user
 * Handles fullName, phone, password, and email with 6-digit OTP verification
 */
export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { fullName, phone, password, email, area, address } = req.body;

  // Basic validation
  if (!fullName || !phone || !password || !email) {
    throw new AppError(400, 'fullName, phone, password, and email are required fields');
  }

  const normalizedPhone = String(phone).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new AppError(400, 'Invalid email address format');
  }

  // ============================================================================
  // [TESTING MODE] - Commented out so you can test registration repeatedly with the same email
  // ============================================================================
  
  /*
  // Check if phone already exists
  const existingUserByPhone = await prisma.user.findUnique({
    where: { phone: normalizedPhone },
  });

  if (existingUserByPhone) {
    throw new AppError(409, 'User with this phone number already exists');
  }

  // Check if email already exists
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUserByEmail) {
    throw new AppError(409, 'User with this email already exists');
  }
  */

  // [TESTING HELPER]: Delete previous record for this email or phone so re-registering succeeds without database unique constraint errors
  await deleteOtp(normalizedEmail);
  await prisma.user.deleteMany({
    where: {
      OR: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    },
  });

  // Hash password
  const passwordHash = await hashPassword(password);

  // Save new user in database (isEmailVerified defaults to false)
  const newUser = await prisma.user.create({
    data: {
      fullName: String(fullName).trim(),
      phone: normalizedPhone,
      email: normalizedEmail,
      passwordHash,
      role: Role.USER,
      status: UserStatus.ACTIVE,
      isEmailVerified: false,
      area: area ? String(area).trim() : null,
      address: address ? String(address).trim() : null,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      role: true,
      status: true,
      avatar: true,
      isEmailVerified: true,
      area: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Generate secure 6-digit random OTP
  const otpCode = crypto.randomInt(100000, 1000000).toString();

  // Save fresh OTP in Redis with 3 minutes (180s) TTL
  await saveOtp(normalizedEmail, otpCode, 180);

  // Send OTP email via nodemailer
  try {
    await sendEmail({
      to: normalizedEmail,
      subject: 'কাছে (Kache) - ইমেইল ভেরিফিকেশন ওটিপি কোড',
      otp: otpCode,
      title: 'ইমেইল যাচাইকরণ ওটিপি কোড',
      purpose: 'কাছে (Kache) লোকাল মার্কেটপ্লেসে স্বাগতম! আপনার অ্যাকাউন্ট নিশ্চিত করতে এবং রেজিস্ট্রেশন সম্পন্ন করতে নিচের ওটিপি (OTP) কোডটি ব্যবহার করুন:',
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }

  // Return response without token (include devOtp in response if SMTP_USER not set in dev)
  const isDevWithoutSmtp =
    process.env.NODE_ENV !== 'production' && !process.env.SMTP_USER;

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Registration successful. Please verify the OTP sent to your email.',
    data: {
      user: newUser,
      ...(isDevWithoutSmtp ? { devOtp: otpCode } : {}),
    },
  });
});

export default register;
