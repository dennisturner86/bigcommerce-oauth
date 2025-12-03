
# bigcommerce-oauth

Framework-agnostic helper for implementing **BigCommerce OAuth + app callbacks** in Node/TypeScript apps.  
Type-safe, adheres to Clean / Screaming Architecture, and built around the **Decorator** pattern for maximum extensibility.

> Handles the boring OAuth + callback plumbing so you can focus on your app’s actual logic.

---

## Features

- **BigCommerce-specific OAuth helpers**
  - Exchange `code` → `access_token` (`POST /oauth2/token`)
  - Verify `signed_payload_jwt` for Load / Remove User / Uninstall callbacks

- **Clean Architecture use-cases**
  - `InstallApp`, `LoadApp`, `RemoveUser`, `UninstallApp`
  - Fully transport- and framework-agnostic

- **Decorator pattern**
  - Add persistence, logging, telemetry, notifications, idempotency, etc.
  - Keeps core flows tiny and testable

- **Typed value objects & DTOs**
  - `AuthSession`, `SignedPayloadClaims`, `StoreHash`

- **Explicit error types**
  - `BigCommerceTokenExchangeError`, `MalformedJwtError`,
    `InvalidJwtSignatureError`, `JwtLifetimeError`,
    `InvalidStoreContextError`

- **Framework-agnostic**
  - Works with Next.js, Express, Hono, serverless functions, etc.

---

## Who is this for?

- Developers building **BigCommerce apps** (public/private)
- Agencies with multiple apps who want **shared OAuth logic**
- Anyone who prefers:
  - TypeScript-first development
  - Clean Architecture patterns
  - Predictable & testable flows
  - Minimal boilerplate

---

## Why this library exists

BigCommerce provides the endpoints — not the architecture.

`bigcommerce-oauth` gives you:

- A reusable, strongly typed OAuth + signed-payload core
- A Clean Architecture structure you can build on
- A decorator pattern so your controllers stay tiny
- Error types that make controller mapping predictable

It removes every OAuth-related point of friction that normally gets copy-pasted between apps.

---

## Installation

```bash
npm install bigcommerce-oauth
# or
pnpm add bigcommerce-oauth
# or
yarn add bigcommerce-oauth
```

Requires:

- Node **>= 18**
- TypeScript recommended

---

# Quick Start

## 1. Install Callback (`/auth`)

BigCommerce redirects to your app’s configured callback, typically:

```
https://yourapp.com/auth
```

The query contains: `code`, `scope`, `context`.

You must:

1. Validate parameters
2. Exchange `code → access_token`
3. Persist your store session (decorators)
4. Return an HTML page

---

# Framework-agnostic minimal example

```ts
import http from "node:http";
import { BigCommerceOAuthClient } from "bigcommerce-oauth/gateways/BigCommerce";
import { InstallApp } from "bigcommerce-oauth/use-cases/install";

const {
  BIGCOMMERCE_CLIENT_ID = "",
  BIGCOMMERCE_CLIENT_SECRET = "",
  BIGCOMMERCE_REDIRECT_URI = "",
} = process.env;

const oauthClient = new BigCommerceOAuthClient(
  BIGCOMMERCE_CLIENT_ID,
  BIGCOMMERCE_CLIENT_SECRET,
);

const installApp = new InstallApp(oauthClient);

function parseQuery(url) {
  const u = new URL(url, "http://localhost");
  return {
    code: u.searchParams.get("code") ?? "",
    context: u.searchParams.get("context") ?? "",
    scope: u.searchParams.get("scope") ?? "",
  };
}

http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/auth")) {
    res.statusCode = 404;
    return res.end("Not found");
  }

  try {
    const { code, context, scope } = parseQuery(req.url);

    if (!code || !context) {
      res.statusCode = 400;
      return res.end("Missing OAuth parameters");
    }

    const session = await installApp.execute(
      { code, context, scope, redirectUri: BIGCOMMERCE_REDIRECT_URI },
      {},
    );

    console.log("Installed for store:", session.context);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.end("<h1>Installation complete</h1>");
  } catch (err) {
    console.error("Install error:", err);
    res.statusCode = 502;
    res.end("Failed to complete installation");
  }
}).listen(3000);
```

---

# Next.js (App Router) Example

This is a simplified version of a real-world setup.

## `/app/(oauth)/auth/_composition/installApp.ts`

```ts
import { BigCommerceOAuthClient } from "bigcommerce-oauth/gateways/BigCommerce";
import { InstallApp } from "bigcommerce-oauth/use-cases/install";

const { BIGCOMMERCE_CLIENT_ID = "", BIGCOMMERCE_CLIENT_SECRET = "" } = process.env;

const oauthClient = new BigCommerceOAuthClient(
  BIGCOMMERCE_CLIENT_ID,
  BIGCOMMERCE_CLIENT_SECRET,
);

export const installApp = new InstallApp(oauthClient);
// Later: wrap installApp with decorators to add persistence, telemetry, etc.
```

---

## `/app/(oauth)/auth/_controllers/createInstallHandler.ts`

```ts
import { BigCommerceTokenExchangeError } from "bigcommerce-oauth/gateways/BigCommerce";
import type { InstallAppUseCase } from "bigcommerce-oauth/use-cases/install";
import { NextRequest, NextResponse } from "next/server";

class MissingOAuthParamsError extends Error {
  constructor() {
    super("Missing OAuth parameters: `code` and `context`");
  }
}

export interface InstallHandlerConfig {
  installApp: InstallAppUseCase;
  redirectUri: string;
}

function getOAuthParams(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") ?? "";
  const context = url.searchParams.get("context") ?? "";
  const scope = url.searchParams.get("scope") ?? "";

  if (!code || !context) throw new MissingOAuthParamsError();

  return { code, context, scope };
}

export function createInstallHandler(config: InstallHandlerConfig) {
  const { installApp, redirectUri } = config;

  return async function GET(req: NextRequest) {
    try {
      const { code, context, scope } = getOAuthParams(req);
      await installApp.execute({ code, context, scope, redirectUri }, {});

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head><meta charset="utf-8" /><title>App Installed</title></head>
          <body><h1>Installation complete</h1></body>
        </html>
      `.trim();

      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (err) {
      if (err instanceof MissingOAuthParamsError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }

      if (err instanceof BigCommerceTokenExchangeError) {
        return NextResponse.json({ error: err.message }, { status: 502 });
      }

      console.error("[/auth] Unexpected error:", err);
      return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
    }
  };
}
```

---

## `/app/(oauth)/auth/route.ts`

```ts
import { installApp } from "./_composition/installApp";
import { createInstallHandler } from "./_controllers/createInstallHandler";

const { BIGCOMMERCE_REDIRECT_URI = "" } = process.env;

export const GET = createInstallHandler({
  installApp,
  redirectUri: BIGCOMMERCE_REDIRECT_URI,
});
```

---

# Handling Load / Remove User / Uninstall

Each callback receives a `signed_payload_jwt`.

### Composition

```ts
import { BigCommerceSignedPayloadVerifier } from "bigcommerce-oauth/gateways/BigCommerce";
import { LoadApp } from "bigcommerce-oauth/use-cases/load";
import { RemoveUser } from "bigcommerce-oauth/use-cases/remove-user";
import { UninstallApp } from "bigcommerce-oauth/use-cases/uninstall";

const verifier = new BigCommerceSignedPayloadVerifier(process.env.BIGCOMMERCE_CLIENT_SECRET || "");

export const loadApp = new LoadApp(verifier);
export const removeUser = new RemoveUser(verifier);
export const uninstallApp = new UninstallApp(verifier);
```

---

### Generic controller example

```ts
function getSignedPayloadJwt(url: string): string {
  const u = new URL(url, "http://localhost");
  const jwt = u.searchParams.get("signed_payload_jwt") ?? "";
  if (!jwt) throw new Error("Missing signed_payload_jwt");
  return jwt;
}

export function createLoadHandler(loadApp) {
  return async function (req, res) {
    try {
      const signedPayloadJwt = getSignedPayloadJwt(req.url);
      const claims = await loadApp.execute({ signedPayloadJwt }, {});
      res.statusCode = 200;
      res.end("OK");
    } catch (err) {
      res.statusCode = 401;
      res.end("Unauthorized");
    }
  };
}
```

Load / remove-user / uninstall all follow the same pattern.

---

# Decorators: Adding Persistence

```ts
import {
  InstallAppDecorator,
  type InstallAppUseCase,
  type InstallAppInput,
} from "bigcommerce-oauth/use-cases/install";
import type { AuthSession } from "bigcommerce-oauth/use-cases/shared";

interface StoreRepository {
  upsertFromSession(session: AuthSession): Promise<void>;
}

export class PersistStoreOnInstall extends InstallAppDecorator {
  constructor(inner: InstallAppUseCase, private readonly repo: StoreRepository) {
    super(inner);
  }

  async execute(input: InstallAppInput, context: any): Promise<AuthSession> {
    const session = await super.execute(input, context);
    await this.repo.upsertFromSession(session);
    return session;
  }
}
```

Use it in composition:

```ts
const base = new InstallApp(oauthClient);
const installApp = new PersistStoreOnInstall(base, storeRepo);
```

---

# Design Philosophy

`bigcommerce-oauth` is intentionally opinionated about **architecture**, not frameworks.

### Clean / Screaming Architecture

- Use cases in `use-cases/*`
- Gateways in `gateways/*`
- Value objects in `value-objects/*`
- No controllers, routing, persistence, or UI logic inside the library

### Decorator pattern

- Add cross-cutting behavior (telemetry, persistence, logging, notifications)
- Keep controllers thin
- Keep use cases pure and easily testable

### Strong typing

- DTOs and value objects enforce correctness:
  - `StoreHash`
  - `AuthSession`
  - `SignedPayloadClaims`

---

# High-Level Architecture

```
┌────────────┐     ┌──────────────────────┐     ┌─────────────────────────┐
│ HTTP Layer │ --> │ Decorators (optional)│ --> │ Core Use Case           │
│ (Next,     │     │ (logging, DB, etc.)  │     │ (Install/Load/Uninstall)│
│  Hono, etc)│     └──────────────────────┘     └──────────┬──────────────┘
└────────────┘                                              │
                                                            ▼
                                                ┌─────────────────────────┐
                                                │ BigCommerce Gateways    │
                                                │  (OAuth, JWT verifier)  │
                                                └─────────────────────────┘
```

---

# Public API

```ts
import {
  BigCommerceOAuthClient,
  BigCommerceSignedPayloadVerifier,

  BigCommerceTokenExchangeError,
  InvalidJwtSignatureError,
  JwtLifetimeError,
  MalformedJwtError,

  InstallApp,
  LoadApp,
  RemoveUser,
  UninstallApp,

  InstallAppDecorator,
  LoadAppDecorator,
  RemoveUserDecorator,
  UninstallAppDecorator,

  type InstallAppInput,
  type LoadAppInput,
  type RemoveUserInput,
  type UninstallAppInput,

  type AuthSession,
  type SignedPayloadClaims,

  StoreHash,
  InvalidStoreContextError,
} from "bigcommerce-oauth";
```

---

# Value Objects

## StoreHash

```ts
const h1 = StoreHash.from("abc123");
const h2 = StoreHash.fromJWTSub("stores/abc123");

h1.equals(h2); // true
```

---

# Error Handling

Map these in your controllers:

- `BigCommerceTokenExchangeError` → `502 / 503`
- `MalformedJwtError` → `400`
- `InvalidJwtSignatureError` → `401`
- `JwtLifetimeError` → `401`
- `InvalidStoreContextError` → `400 / 422`

---

# Security Notes

- Always use HTTPS
- Never trust raw query parameters
- Always verify `signed_payload_jwt`
- Do not log secrets or raw JWTs
- Validate store identity using `StoreHash`
- Handle JWT lifetime errors strictly

# License

MIT — see `LICENSE.md` file.
