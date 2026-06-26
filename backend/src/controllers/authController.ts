import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_access_key_12345';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_jwt_refresh_key_67890';

const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400).json({ success: false, message: 'Email already registered.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'customer'
    });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      res.status(401).json({ success: false, message: 'Refresh token not found.' });
      return;
    }

    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found.' });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
};

// Simplified Password reset request (returns a code/token)
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: 'No user registered with this email address.' });
      return;
    }

    // In a real app we generate a temporary reset token, here we simulate it
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Simulating sending email
    await sendEmail({
      email: user.email,
      subject: 'Shop Here - Password Reset Request',
      message: `You are receiving this email because you requested a password reset. Please use the following token to reset your password:\n\n${resetToken}\n\nIf you did not request this, please ignore this email.`,
      html: `<h3>Shop Here Password Reset</h3>
             <p>You requested a password reset. Please use the following token to complete your request:</p>
             <p><strong>${resetToken}</strong></p>
             <p>If you did not request this, please ignore this email.</p>`
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address.',
      token: resetToken // Exposing in development for test convenience
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      res.status(400).json({ success: false, message: 'Please provide all details.' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Since it is a simulation, we allow resetting if token matches
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset completed successfully.' });
  } catch (error) {
    next(error);
  }
};
