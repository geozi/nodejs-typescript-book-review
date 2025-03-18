import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { redisClient } from "../../redis.config";
import * as dotenv from "dotenv";
dotenv.config();

// Strategy for User role.

const user_strategy_options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.USER_KEY as string,
};

passport.use(
  "user-strategy",
  new Strategy(user_strategy_options, async (payload, done) => {
    try {
      const user = await redisClient.get(payload.loggedInUser);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Strategy for Admin role.

const admin_strategy_options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ADMIN_KEY as string,
};

passport.use(
  "admin-strategy",
  new Strategy(admin_strategy_options, async (payload, done) => {
    try {
      const user = await redisClient.get(payload.loggedInUser);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
