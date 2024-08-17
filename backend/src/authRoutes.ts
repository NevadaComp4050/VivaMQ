import { Router } from 'express';
import passport from 'passport';
import prisma from '@/lib/prisma';
import argon2 from 'argon2';

const router = Router();

// Registration route
router.post('/register', async (req, res) => {
  const { email, name, phone, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create the new user
    const user = await prisma.users.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
      },
    });

    // Automatically log the user in after registration
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in after registration.' });
      }
      return res.status(201).json({ message: 'Registration successful.', user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Local authentication route (existing)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('/');
  });
});

// Microsoft OAuth authentication (existing)
router.get(
  '/microsoft',
  passport.authenticate('microsoft', { prompt: 'select_account' })
);

router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

export default router;
