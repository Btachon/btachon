import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, mkdir, rename } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const outDir = path.resolve(rootDir, "netlify/functions");

await mkdir(outDir, { recursive: true });
await rm(path.join(outDir, "api.mjs"), { force: true });

await esbuild({
  entryPoints: [path.resolve(__dirname, "src/netlify-entry.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outdir: outDir,
  outExtension: { ".js": ".mjs" },
  logLevel: "info",
  external: [
    "*.node",
    "sharp",
    "better-sqlite3",
    "sqlite3",
    "canvas",
    "bcrypt",
    "argon2",
    "fsevents",
    "re2",
    "pg-native",
    "oracledb",
    "mongodb-client-encryption",
    "nodemailer",
    "handlebars",
    "knex",
    "typeorm",
    "@prisma/client",
    "@mikro-orm/*",
    "@grpc/*",
    "@aws-sdk/*",
    "@google-cloud/*",
    "googleapis",
    "firebase-admin",
    "@sentry/profiling-node",
    "aws-sdk",
    "dd-trace",
    "mysql2",
    "newrelic",
    "sequelize",
    "snappy",
    "workerd",
    "wrangler",
  ],
  sourcemap: false,
  plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
  },
});

// Rename netlify-entry.mjs → api.mjs (Netlify uses the filename as the function name)
await rename(
  path.join(outDir, "netlify-entry.mjs"),
  path.join(outDir, "api.mjs"),
);
console.log("✓ netlify/functions/api.mjs ready");
