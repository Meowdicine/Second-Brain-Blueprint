/* eslint-disable @typescript-eslint/no-require-imports */
"use strict";

const path = require("path");

/**
 * Work around a Node 24 + Tailwind 4 loader registration failure on Windows:
 * Error: EINVAL at module.register -> AsyncLoaderHookWorker.
 *
 * Deprecated transition shim:
 * - The default runtime baseline is Node 22 LTS.
 * - Keep this file during migration only.
 *
 * We only swallow that specific EINVAL and preserve default behavior otherwise.
 */
try {
  const projectRoot = path.resolve(__dirname, "..");
  if (process.cwd() !== projectRoot) {
    process.chdir(projectRoot);
  }
} catch {
  // Best-effort project root normalization.
}

try {
  const mod = require("module");
  if (typeof mod.register === "function") {
    const originalRegister = mod.register.bind(mod);
    mod.register = (...args) => {
      try {
        return originalRegister(...args);
      } catch (err) {
        if (err && err.code === "EINVAL") {
          return undefined;
        }
        throw err;
      }
    };
  }
} catch {
  // Best-effort compatibility shim.
}
