---
title: std/relays
---

```ts
import { ... } from "nterac/std/relays/mod.ts"
```

## Functions
### RequestParser
Parses the request with the `beforehandler`. Returns a `REQ` object.

### ResponseSigner
Adds a `server: nterac` header to the response using `afterhandler`. Would be glad if you used it `:)`.

## Interfaces
### BeforeHandler
```ts
export interface BeforeHandlerParams {
  req: Request;
  info: Deno.ServeHandlerInfo;
  server: Server;
}
export interface BeforeHandlerReturns {
  result?: any;
  result_request?: any;
  response?: Response;
}
```

### AfterHandler
```ts
export interface AfterHandlerParams {
  response: Response;
  req?: any;
  bh_result?: any;
  server: Server;
  info: Deno.ServeHandlerInfo;
}
export interface AfterHandlerReturns {
  response: Response;
}
```