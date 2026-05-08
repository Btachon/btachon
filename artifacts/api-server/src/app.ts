import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createRequire } from "module";
// Import type only — pulls in the Express Request augmentation (req.log)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type _pinoHttpTypes from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";

const _require = createRequire(import.meta.url);
// Use createRequire to get the callable CJS function regardless of TS moduleResolution setting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pinoHttp: (...args: any[]) => any = _require("pino-http");

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: { id: string; method: string; url?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: { statusCode: number }) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({
  credentials: true,
  origin: (origin, cb) => cb(null, origin ?? "*"),
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

// Disable HTTP caching for all API routes so clients always get fresh data
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use("/api", router);

export default app;
