import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import friendsRouter from "./friends";
import friendRequestsRouter from "./friendRequests";
import tutorsRouter from "./tutors";
import videosRouter from "./videos";
import pulseRouter from "./pulse";
import notificationsRouter from "./notifications";
import learnSessionsRouter from "./learnSessions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(friendsRouter);
router.use(friendRequestsRouter);
router.use(tutorsRouter);
router.use(videosRouter);
router.use(pulseRouter);
router.use(notificationsRouter);
router.use(learnSessionsRouter);

export default router;
