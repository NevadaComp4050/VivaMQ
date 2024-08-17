import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import prisma from '@/lib/prisma';

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.users.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.users.create({
            data: {
              email: profile.emails?.[0].value!,
              name: profile.displayName || profile.username!,
              githubId: profile.id,
            },
          });
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