import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import argon2 from 'argon2';
import prisma from '@/lib/prisma';

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        const isValidPassword = await argon2.verify(user.password!, password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });