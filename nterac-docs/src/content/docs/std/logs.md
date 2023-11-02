---
title: std/logs
---

```ts
import { ... } from "nterac/std/logs/mod.ts";
```

The `std/logs` is a configurable logger.

Rules can be defined with objects, which type is `Record<string, boolean>`, or through environment variables.

General keys use the pattern: `main-context.function.functionality`. For example: `server.serve.request`.

In env vars, dots should be replaced with underscore, and must start with `NTERAC_LOGS_`. For example: `NTERAC_LOGS_server_serve_request`.

To set all logs to true, simply set the env var `NTERAC_LOGS` to `true`.

## Usage
Example server code: 
```ts
const server = new Server({
  manifest: manifest,
  logs: rules
});
server.serve();
```

The `logrules.ts` file contains:
```ts
export const rules: Record<string, boolean> = {
  "all": true
}
```
The naming isn't restricted, the example simply uses this names and structure because it's practical.

## Custom logs
It can also be used in custom codes. 

Custom rule keys can be defined using the config rules or env vars, and than the `logger` function can be used to check on the keys existence, and to log out the .

## Functions
### `logger`
This function checks the existence of the provided key in the provided store, and logs out the given message on the given level.

The output in the console will include the `log` and the `logId`.

*parameters:*
 - `logs: Record<string, boolean>`: the logger config
 - `logId: string`: the rule key of the given log
 - `log: unknown`: any object, string, etc. to be logged out
 - `levels?: LogLevels`: the level of the logging

```ts
type LogLevels = "info" | "warning" | "error";
```

Example code:
```ts
export default function ({store}: HandlerParams) {
  logger(store, 'handlers.index.example', 'my custom logger');
  return new Request('Example response');
}
```

This outputs (if the log rules were correctly set):
```
{ log: "my custom logger", logId: "handlers.index.example" }
```

## Predefined keys
Object key / Env key | Description
-|-
`all` `NTERAC_LOGS`|Logs out everything, which uses `std/logs/logger`.
`server.constructor.manifest` `server_constructor_manifest`|Logs out the manifest's value in the server constructor.
`server.constructor.relays` `server_constructor_relays`|Logs out the relays used in the server constructor.
`server.serve.request` `server_serve_request`|Logs out the incoming request.
`server.serve.relays.beforehandler` `server_serve_relays_beforehandler`|Logs out when the `beforehandler` starts running.
`server.serve.relays.beforehandler.result` `server_serve_relays_beforehandler_result`|Logs out the return values of the `beforehandler`.
`server.serve.input` `server_serve_input`|Logs out the values passed down to the request handler and/or the middleware.
`server.serve.middleware` `server_serve_middleware`|Logs out when the middleware starts running.
`server.serve.middleware.result` `server_serve_middleware_result`|Logs out the values the middleware returned.
`server.serve.afterhandler` `server_serve_afterhandler`|Logs out when the `afterhandler` starts running.
`server.serve.afterhandler.result` `server_serve_afterhandler_result`|Logs out the values the `afterhandler` returns with.
`server.serve.response` `server_serve_response`|Logs out the response the server sent back to the client.

Note that the env keys presented here are yet to prefixed with `NTERAC_LOGS_`.