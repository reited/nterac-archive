---
title: Middlewares
---

For now, middlewares can only be defined as exported functions in routes, named `middleware`. This might change in the future as well as other things.

To create a middleware, a route needs to export a function named `middleware`.

The root module has an interface `MiddlewareParams` exported containing the middleware parameters.
```ts
export interface MiddlewareParams {
  req: Request | any;
  bh_result?: any;
  server: Server;
  info: Deno.ServeHandlerInfo;
  next: Function;
}
```

Example code:
```ts
import { HandlerParams, MiddlewareParams } from "nterac/mod.ts";

export default function ({req}: HandlerParams) {
  return new Response('Hello world!');
}

export function middleware({req, next}: MiddlewareParams) {
  // do middleware logic
  return next();
}
```
Note that:
 - you don't need to use the `next` function,
 - the `next` function will return the response, so that value needs to be returned (this might change).

Example code without `next`:
```ts
export function middleware({req}: MiddlewareParams) {
  // do middleware logic
}
```
This means, when the `middleware` function exits without a value, then the route function chain continues.