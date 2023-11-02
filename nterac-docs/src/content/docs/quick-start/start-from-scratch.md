---
title: Start From Scratch
---

Learn how an nterac project builds up from the ground up.

## Create a server
This example uses the file `main.ts`. The `main.ts` acts as the entry point of the server. But that doesn't mean, that's the only file a project needs.

Creating a server in the `main.ts`:
```ts
import { Server } from "nterac/mod.ts";
import { manifest } from "_/exportmap.ts";

const server = new Server({
  manifest: manifest
});
server.serve();
```

The `server.serve` will look for routes in the `api` folder (this might change).

The `ServerOptions` interface:
```ts
interface ServerOptions {
  manifest: Record<string, object>;
  relays?: Relays
  plugins?: [Function]
}
```
 - `manifest`: it's the object containing of the imported routes. More about it later. It's the only required constructor parameter.
 - `relays` and `plugins`: see the `Building Blocks` chapter.

## api folder
The `server.serve` uses the folder named `api` to search for routes, so it needs to be created.

## Manifest
The `manifest` contains the information of the routes in production. It's required, because serverless environments are not completely support dynamic imports.

The template comes with the prebuilt command `deno task preview`, which generates it automatically. It also imports it from a file named `exportmap.ts`. It isn't neccessary to use `exportmap.ts`, but as a seperate file, it can be generated and doesn't need to be updated by hand.

A manifest, in developement mode, can be equal to 
```ts
export const manifest: Record<string, any> = {}
```
It doesn't need to be exported and imported, if it's defined in the `main.ts`, but then it needs to be updated by hand.

### Updating manifest
nterac as a module has a `generate_exportmap.ts` file with an exported function `async generateExportMap`. This can regenerate the manifest.

Simply import and invoke it in a different file, and the manifest defined in the `exportmap.ts` should be updated. You can simply copy the `.nterac` folder from the template and then configurate the `config.json` correctly.

Updating by hand:
```ts
import * as $0 from "./api/index.ts";

export const manifest: Record<string, object> = {
  "/": $0,
}
```

In the example code above, the route was imported as `$0` (but can be named anything), and then simply assigned to it's request pathname.

This task needs to be done to all route, you want to be available in production.

## Config
The `deno.json` file contains the config for the template. This should be the same when creating from scratch.

Example:
```json
{
  "tasks": {
    "start": "deno run --unstable --allow-all main.ts",
    "dev": "deno run --unstable --allow-all .nterac/dev.ts",
    "preview": "deno run --unstable --allow-all .nterac/preview.ts"
  },
  "imports": {
    "_/": "./",
    "nterac/": "https://deno.land/x/nterac/"
  }
}
```
Note that if the `.nterac` folder is used, the `dev` and `preview` tasks must be present like that.

Note that if the `nterac/` imports are used, the `nterac/` imports should be configured. The `_/` imports helps to import things consistently as it works with the root folder.

## .gitignore
The `.nterac` folder can be ignored. If you use Github Actions to generate the exportmap, the local `exportmap.ts` can be ignored, but the `.nterac/preview.ts` shouldn't.