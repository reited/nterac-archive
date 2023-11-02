---
title: Handlers
---

Exported functions, which sends back `Response` and are at the end of the route function chain are called handlers.

The root module has an interface of what parameters should a handler get:
```ts
export interface HandlerParams {
  req: Request | any;
  bh_result?: any;
  server: Server;
  info: Deno.ServeHandlerInfo;
}
```
 - `req`: the incoming request, or the request the `beforehandler` relay returned
 - `bh_result`: the result of the `beforehandler` relay
 - `server`: the `server` object

Example: 
```ts
import { HandlerParams } from "nterac/mod.ts";

export default function ({req}: HandlerParams) {
  return new Response('Hello world!');
}
```

Note that handlers: 
 - don't need names (for now),
 - and are `default` exported functions.