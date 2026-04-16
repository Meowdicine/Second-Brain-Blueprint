"use strict";

const expectedMajor = 22;
const current = process.versions.node;
const major = Number.parseInt(current.split(".")[0], 10);

if (major === expectedMajor) {
  process.exit(0);
}

console.error(
  [
    "",
    "ERROR: Unsupported Node.js version for default dashboard dev runtime.",
    `Detected: v${current}`,
    `Required: Node.js ${expectedMajor}.x LTS`,
    "",
    "How to fix:",
    `1) Switch runtime: nvm use ${expectedMajor}`,
    "2) Re-run: npm run dev",
    "",
    "Emergency fallback (temporary): npm run dev:webpack",
    "",
  ].join("\n")
);

process.exit(1);
