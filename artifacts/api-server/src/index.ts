import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function startServer(port: number, retries = 15, delayMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const started = await new Promise<boolean>((resolve) => {
      const server = app.listen(port);

      server.once("listening", () => {
        logger.info({ port }, "Server listening");
        resolve(true);
      });

      server.once("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          logger.warn({ port, attempt }, "Port in use, retrying...");
          server.close(() => resolve(false));
        } else {
          logger.error({ err }, "Error listening on port");
          process.exit(1);
        }
      });
    });

    if (started) return;
    await new Promise(r => setTimeout(r, delayMs));
  }

  logger.error({ port }, "Could not bind port after all retries");
  process.exit(1);
}

startServer(port);
