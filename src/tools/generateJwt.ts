/**
 * generateJwt.ts
 *
 * Helper script for generating Fireblocks JWTs for Postman testing.
 *
 * NOT required when using the Fireblocks SDK.
 * Intended only for learning/debugging raw REST calls (e.g., Postman/curl).
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function usageAndExit(): never {
  console.error(
    'Usage:\n  pnpm tsx src/tools/generateJwt.ts "/v1/..." [--debug]\n\n' +
      'Examples:\n' +
      '  pnpm tsx src/tools/generateJwt.ts "/v1/vault/accounts_paged"\n' +
      '  pnpm tsx src/tools/generateJwt.ts "/v1/vault/accounts/0/ETH/addresses_paginated"\n' +
      '  pnpm tsx src/tools/generateJwt.ts "/v1/vault/accounts/0/ETH/addresses" --debug\n'
  );
  process.exit(1);
}

const args = process.argv.slice(2).filter((a) => a !== "--");
const uriArg = args.find((a) => a.startsWith("/v1/"));
const debug = args.includes("--debug");

if (!uriArg) usageAndExit();

const apiKey = process.env.FIREBLOCKS_API_KEY;
const privateKeyPath = process.env.FIREBLOCKS_SECRET_PATH;

if (!apiKey) throw new Error("Missing FIREBLOCKS_API_KEY in .env");
if (!privateKeyPath) throw new Error("Missing FIREBLOCKS_SECRET_PATH in .env");

const resolvedKeyPath = path.resolve(privateKeyPath);
if (!fs.existsSync(resolvedKeyPath)) {
  throw new Error(`Private key not found at path: ${resolvedKeyPath}`);
}

const privateKeyPem = fs.readFileSync(resolvedKeyPath, "utf8");
const privateKey = crypto.createPrivateKey(privateKeyPem);

const now = Math.floor(Date.now() / 1000);

// IMPORTANT: `uri` must EXACTLY match the request path (no domain, no query string)
const payload = {
  uri: uriArg,
  sub: apiKey,
  nonce: Date.now(), // numeric nonce
  iat: now - 30,     // small skew buffer
  exp: now + 180,    // 3 minutes (manual Postman-friendly)
};

const token = jwt.sign(payload, privateKey, {
  algorithm: "RS256",
  header: {
    typ: "JWT",
    alg: "RS256",
    kid: apiKey,
  },
});

// Print ONLY the token by default to avoid newline/header copy issues.
console.log(token);

if (debug) {
  const decoded = jwt.decode(token, { complete: true });
  console.error("\nDecoded JWT (debug):");
  console.error(JSON.stringify(decoded, null, 2));
}
