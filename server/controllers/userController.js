import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shiva123';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc Register a new user
// @route POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, fullName, email, password, currency, monthlyBudget } = req.body;
    const finalName = name || fullName;

    if (!finalName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: Name, Email, and Password',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: finalName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      currency: currency || 'USD',
      monthlyBudget: monthlyBudget !== undefined ? Number(monthlyBudget) : 3000,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc Authenticate user & get token
// @route POST /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc Get logged-in user profile
// @route GET /api/user/getUser or /api/user/profile or /api/user/me
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};

// @desc Update user profile details (currency, budget, name)
// @route PUT /api/user/update or /api/user/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, fullName, currency, monthlyBudget, profileImageUrl } = req.body;

    if (name || fullName) {
      user.name = (name || fullName).trim();
    }
    if (currency) {
      user.currency = currency;
    }
    if (monthlyBudget !== undefined) {
      user.monthlyBudget = Number(monthlyBudget);
    }
    if (profileImageUrl !== undefined) {
      user.profileImageUrl = profileImageUrl;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        name: updatedUser.name,
        fullName: updatedUser.name,
        email: updatedUser.email,
        currency: updatedUser.currency,
        monthlyBudget: updatedUser.monthlyBudget,
        profileImageUrl: updatedUser.profileImageUrl,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
};

// @desc Change user password
// @route PUT /api/user/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error changing password',
    });
  }
};
