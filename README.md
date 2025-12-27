# Fireblocks TypeScript Demo (SDK + REST)

This repository is a hands-on demo project for learning how to interact with the Fireblocks platform using:

- Fireblocks TypeScript SDK (recommended)
- Fireblocks REST API (for learning and Postman testing)

The project is designed to be:
- beginner-friendly
- aligned with the Fireblocks Console
- chain-agnostic
- easy to extend and experiment with

We intentionally demonstrate the same operations across **Ethereum (ETH)**, **Solana (SOL)**, and **Polygon (MATIC_POLYGON)** to highlight how Fireblocks abstracts differences between blockchains.

---

## Prerequisites

- Node.js ≥ 18
- pnpm
- A Fireblocks workspace
- A Fireblocks API User with:
  - API Key
  - API Private Key file

---

## Project Structure

```
src/
  commands/
    listVaults.ts
    createVault.ts
    listDepositAddresses.ts
    createDepositAddress.ts
  lib/
    fireblocks.ts
  tools/
    generateJwt.ts   # REST / Postman helper only
secrets/
  fireblocks_secret.key
.env
```

---

## Environment Configuration

Create a `.env` file in the project root:

```env
FIREBLOCKS_API_KEY=<YOUR_API_KEY>
FIREBLOCKS_SECRET_PATH=./secrets/fireblocks_secret.key

# Use sandbox unless you explicitly intend to use prod
# FIREBLOCKS_BASE_PATH=https://sandbox-api.fireblocks.io/v1
FIREBLOCKS_BASE_PATH=https://api.fireblocks.io/v1
```

> Never commit your private key or `.env` file.

---

## SDK vs REST API

Fireblocks exposes **one REST API**, but provides **SDKs** to simplify usage.

### Fireblocks SDK (recommended)

- Automatically handles JWT creation and signing
- Prevents URL mismatch and expiration errors
- Handles pagination and retries
- Safer and easier for production integrations

All core commands in this repository use the **Fireblocks TypeScript SDK**.

---

### Fireblocks REST API (learning only)

- Requires manually generating JWTs
- Useful for:
  - Postman
  - curl
  - understanding authentication mechanics

This repository includes a helper script (`generateJwt.ts`) **only for educational purposes**.

---

## Fireblocks REST Authentication (JWT)

When calling Fireblocks REST APIs directly (for example via Postman or curl),
the JWT `uri` claim **must exactly match** the request target.

### Rules

- Include `/v1`
- Include query string if present
- Exclude domain
- Exclude headers
- Match byte-for-byte (no trailing slashes)

### Example

**Request**
```
GET /v1/vault/accounts_paged?limit=50
```

**JWT payload**
```json
{
  "uri": "/v1/vault/accounts_paged?limit=50",
  "sub": "<API_KEY>",
  "nonce": <number>,
  "iat": <unix>,
  "exp": <unix>
}
```

If the URI does not match exactly, Fireblocks will return:

```
Unauthorized: Token signed for incorrect url
```

---

## Vault Accounts

### List Vault Accounts

Equivalent to:

> Fireblocks Console → Vault → Vault Accounts

```bash
pnpm run list:vaults
```

This uses the paginated endpoint:

```
GET /v1/vault/accounts_paged
```

---

### Create Vault Account

```bash
pnpm run create:vault
```

Creates a new vault account in your Fireblocks workspace.

---

## Assets & Deposit Addresses  
### ETH vs SOL vs POLYGON

This section demonstrates how **the same API calls work across different blockchains**.

### Create Deposit Address

```bash
# Ethereum
pnpm run create:deposit -- 0 ETH

# Solana
pnpm run create:deposit -- 0 SOL

# Polygon
pnpm run create:deposit -- 0 MATIC_POLYGON
```

---

### List Deposit Addresses

```bash
# Ethereum
pnpm run list:deposit -- 0 ETH

# Solana
pnpm run list:deposit -- 0 SOL

# Polygon
pnpm run list:deposit -- 0 MATIC_POLYGON
```

---

### What to Observe

| Chain | Address Format | Notes |
|------|---------------|-------|
| ETH | `0x...` | EVM-based |
| POLYGON | `0x...` | Same format as ETH, different network |
| SOL | Base58 | Non-EVM chain |

The API pattern and authentication are identical across all three chains.

---

## Why This Matters

Fireblocks abstracts:
- blockchain differences
- address formats
- signing logic
- security policies

This allows developers to:
- write chain-agnostic code
- automate workflows safely
- scale across networks without rewriting logic

---

## Postman (Optional)

To experiment with raw REST calls:

```bash
pnpm tsx src/tools/generateJwt.ts
```

Paste the generated JWT into Postman:

```
Authorization: Bearer <JWT>
x-api-key: <API_KEY>
```

JWTs expire quickly (typically under 3 minutes).

---

## Next Steps

Planned extensions for this demo:

- Transactions (list / get)
- Approval and policy introspection
- Contract calls (ERC-20 mint / burn)
- Tokenization and contract call demos (advanced)

---

## Disclaimer

This project is for **educational and demonstration purposes only**.  
Always follow Fireblocks security best practices when building production systems.