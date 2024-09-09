import { Router } from 'express';
import passport from 'passport';
import prisma from '@/lib/prisma';
import argon2 from 'argon2';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, phone, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      const hashedPassword = await argon2.hash(password);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
        },
      });

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
  }
);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

router.post(
  '/test-login',
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error.' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Login failed.', reason: info.message });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Login failed.' });
        }
        return res.status(200).json({ message: 'Login successful.', user: { id: user.id, email: user.email, name: user.name } });
      });
    })(req, res, next);
  }
);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

router.get('/current-user', isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;