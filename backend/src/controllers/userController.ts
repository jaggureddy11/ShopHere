import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated.' });
      return;
    }
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated.' });
      return;
    }
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
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

export const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated.' });
      return;
    }
    const user = await User.findById(req.user.id).select('addresses');
    res.status(200).json({ success: true, addresses: user?.addresses || [] });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated.' });
      return;
    }
    const { street, city, state, postalCode, country, isDefault } = req.body;

    if (!street || !city || !state || !postalCode || !country) {
      res.status(400).json({ success: false, message: 'All address fields are required.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // If marked as default, clear others
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      street,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || user.addresses.length === 0 // Default if it's the first one
    });

    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated.' });
      return;
    }
    const { addressId } = req.params;
    const { street, city, state, postalCode, country, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const address = user.addresses.find(addr => addr._id?.toString() === addressId);
    if (!address) {
      res.status(404).json({ success: false, message: 'Address not found.' });
      return;
    }

    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (postalCode) address.postalCode = postalCode;
    if (country) address.country = country;

    if (isDefault !== undefined) {
      if (isDefault) {
        user.addresses.forEach(addr => {
          addr.isDefault = false;
        });
      }
      address.isDefault = isDefault;
    }

    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated.' });
      return;
    }
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const wasDefault = user.addresses.find(addr => addr._id?.toString() === addressId)?.isDefault;

    user.addresses = user.addresses.filter(addr => addr._id?.toString() !== addressId) as any;

    // Reset default address if we deleted the default one
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};
