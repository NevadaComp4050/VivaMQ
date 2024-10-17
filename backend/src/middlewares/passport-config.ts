import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { type $Enums, PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? 'your_secret';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export const configurePassport = (): void => {
  passport.use(
    new JwtStrategy(
      opts,
      async (
        // eslint-disable-next-line @typescript-eslint/naming-convention
        jwt_payload: { sub: string },
        done: (
          arg0: null,
          arg1:
            | boolean
            | {
                id: string;
                createdAt: Date;
                email: string;
                name: string;
                phone: string | null;
                password: string;
                role: $Enums.Role;
              }
        ) => any
      ) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: jwt_payload.sub },
          });

          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
};
