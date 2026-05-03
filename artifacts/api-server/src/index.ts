import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function startServer(port: number, retries = 10, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    await new Promise<void>((resolve, reject) => {
      const server = app.listen(port, (err?: Error) => {
        if (err) { reject(err); return; }
        logger.info({ port }, "Server listening");
        resolve();
      });
      server.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE" && attempt < retries) {
          logger.warn({ port, attempt }, "Port in use, retrying...");
          server.close();
          reject(err);
        } else {
          logger.error({ err }, "Error listening on port");
          process.exit(1);
        }
      });
    }).catch(async (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        await new Promise(r => setTimeout(r, delayMs));
      }
    });

    // If we got here without process.exit, the server is up
    return;
  }
}

startServer(port);
