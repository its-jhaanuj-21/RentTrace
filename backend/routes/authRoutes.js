import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user.id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @desc    Login/Register using Google ID Token
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google ID token credential is required' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('GOOGLE_CLIENT_ID environment variable is missing.');
      return res.status(500).json({
        message: 'Google Sign-In is not configured on the backend server. Please configure GOOGLE_CLIENT_ID.'
      });
    }

    const client = new OAuth2Client(googleClientId);

    // Verify token with Google's servers
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: googleClientId
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Google account does not provide an email address' });
    }

    // Try finding user by googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // If not found, check if a user with the same email exists
      user = await User.findOne({ email });

      if (user) {
        // Link googleId to existing standard user
        user.googleId = googleId;
        if (picture && !user.picture) {
          user.picture = picture;
        }
        await user.save();
      } else {
        // Register new user
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          picture: picture || ''
        });
      }
    } else {
      // User exists by Google ID; update picture/name if changed
      let updated = false;
      if (picture && user.picture !== picture) {
        user.picture = picture;
        updated = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(400).json({ message: 'Google authentication failed', error: error.message });
  }
});

// @desc    Update user profile details (Name, Password, and Picture)
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, picture, currentPassword, newPassword } = req.body;

    // 1. Update name if provided
    if (name) {
      user.name = name;
    }

    // 2. Update picture if provided
    if (picture !== undefined) {
      user.picture = picture;
    }

    // 3. Update password if requested
    if (newPassword) {
      // Standard email users must verify their current password first
      if (!user.googleId) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Please provide your current password to update it.' });
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect.' });
        }
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: req.headers.authorization.split(' ')[1]
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
});

export default router;
