/**
 * Inter-service routes.
 * @module src/routes/interServiceRoutes
 */
import { Request, Response, Router } from "express";
import passport from "passport";
import { httpCodes } from "resources/codes/responseStatusCodes";

export const interServiceRouter = Router();
interServiceRouter.get(
  "/admin",
  passport.authenticate("admin-strategy", { session: false }),
  (req: Request, res: Response) => {
    if (req.user) {
      res.status(httpCodes.OK);
      return;
    }
  }
);
interServiceRouter.get(
  "/user",
  passport.authenticate("user-strategy", { session: false }),
  (req: Request, res: Response) => {
    if (req.user) {
      res.status(httpCodes.OK);
      return;
    }
  }
);
