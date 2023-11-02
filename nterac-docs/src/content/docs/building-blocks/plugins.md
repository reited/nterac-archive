---
title: Plugins
---

:::danger

As of [v0.5.5](https://github.com/3sdf/nterac/releases/tag/v0.5.5), plugins are unavailable for the time being, and under consideration.

See the [Github Discussion](https://github.com/3sdf/nterac/discussions/13).

:::

Plugins allow you, the developer, to run functions in the `server` constructor.  
Plugins have access to the full `server`.

To use a plugin:
```ts
const server = new Server({
  manifest: manifest,
  plugins: [
    () => { console.log(`I'm a cat. >(^_^)>`) }
  ]
});
```
This will log out to the console, before the server starts: `I'm a cat. >(^_^)>`.  
Note that the `plugins` is an array of functions, so more plugins can be used at once.

## Guidelines
There are recommendations on how to use and write a plugin.

While using `server.store`, try to name variables as uniqueally as possible. This will help to avoid conflicts with other plugins using `server.store`.

## Public plugins
There are plans for an `https://nterac.deno.dev/plugins` to build an open database about the plugins, so naming things in `server.store` would be yet simpler.  

This would also make plugin distribution, discovery simpler.