---
title: Server
---

```ts
import { Server } from "nterac/mod.ts";
```

## Properties
### `serve`
The function which starts the server.  
It is configurable with `ServeOptions`. The interface:
```ts
interface ServeOptions {
  port?: number;
  hostname?: string;
  signal?: AbortSignal;
}
```
 - `port`: the port, on which the server listens
 - `hostname`: the hostname/ip address of the server

Example code:
```ts
server.serve({
  port: 8001,
});
```
This will serve the app on `localhost:8001`.

### `store`
An object, which can store any data. It is accessible from the `before` and `afterhandler`, the `handler`, plugins.

It's used to store data from plugins, but can practically store data from anywhere, until the end of the server.

Example code:
```ts
export default function ({req, store}: HandlerParams) {
  store['example'] = 'code';
  return new Response('Hello world!');
}
```
This will save `store.example` as `'code'`, and it can be accessed later.