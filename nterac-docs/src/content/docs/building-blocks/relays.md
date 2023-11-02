---
title: Relays
---

Relays are functions, which intercepts the request or the response flow.
```
incoming request => 
  (beforehandler: relay) => (handlers) => (afterhandler: relay) 
=> outgoing response
```
In the case above, the relays are the `beforehandler` and the `afterhandler`.

The `std` library has built-in relays and interfaces.

## Usage
In the server config, pass in the relays like uninvoked functions.  
The server config uses this interface:
```ts
interface Relays {
  beforehandler?: Function;
  afterhandler?: Function;
}
```

Example code:
```ts
const server = new Server({
  manifest: manifest,
  relays: { beforehandler: RequestParser, afterhandler: ResponseSigner }
});
```
Relays also work in solo, you don't need to have `before` and `afterhandler`, you can have just `before` or `afterhandler`.

## beforehandler
Runs right after the request arrives to the server. No middleware or even route existence checking ran at this point (laster might change).

There are available interfaces from the `std/relays` library.
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
 - `server`: the `server` object

 - `result`: the result of the beforehandler
 - `result_request`: the request, that will be accessible in the handlers, if provided

Example code:
```ts
export function BeforeHandler ({req}: BeforeHandlerParams) {
  // parse request, do any logic  
  return { result_request: req };
}
```
If a `Response` is returned, the server will immediately send it. No `afterhandler` will intercept it (it might change).

## afterhandler
Runs after everything finished from middlewares to handlers, when the server would send back the response.

There are available interfaces from the `std/relays` library.
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
 - `response`: contains what the handler returned as response.
 - `req`: contains the request or what the beforehandler returned as `result_request`
 - `bh_result`: the beforehandler's result.
 - `store`: the `server.store` object

Example code:
```ts
export function AfterHandler ({response}: AfterHandlerParams) {
  // parse the response, do any logic
  return response;
}
```

The `afterhandler` must return a `Response`.