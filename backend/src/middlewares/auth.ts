import { type Request, type Response, type NextFunction } from 'express';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? 'your_secret';
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.sub },
        });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false, { message: 'Error during authentication' });
      }
    }
  )
);

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Running verifyAuthToken');
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error in authentication: ', err);
      next(err);
      return;
    }
    if (!user) {
      console.log('Authentication failed:', info?.message || 'Unauthorized');
      return res.status(401).json({ error: info?.message || 'Unauthorized' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const generateAuthToken = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });
    return res.json({ token });
  } catch (err) {
    console.error('Error generating token: ', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
