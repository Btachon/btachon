import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import friendsRouter from "./friends";
import videosRouter from "./videos";
import pulseRouter from "./pulse";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(friendsRouter);
router.use(videosRouter);
router.use(pulseRouter);

export default router;
