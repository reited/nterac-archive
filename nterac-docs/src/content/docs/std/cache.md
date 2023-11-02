---
title: std/cache
---

```ts
import { ... } from "nterac/std/cache/mod.ts"
```

:::caution
`LocalCache` and `LocalCacheStorage` is not supported yet in Deno Deploy.
[View](https://deno.com/deploy/docs/runtime-api#future-support)
:::

## LocalCache

`LocalCache` is a class, using the Deno Cache API, but handling the caching task a bit simpler.  
This saves the cache into the file-system.

__Constructor parameters:__
 - `storagename: string`: the name of the CacheStorage, the operation will be made on.

### Properties
#### `async put: Function`
The `put` function puts a new `Response` under the given url into the `CacheStorage`.

*parameters:*
 - `name: string`: the url string of the cache.
 - `value: string`: the `Response` to be saved in the storage.
 - `options?: LocalCacheOptions`: the options of the caching.

```ts
interface LocalCacheOptions {
  maxage?: number;
  expires?: Date;
}
```
Just as usual, the `maxage` needs to be provided in seconds.

Example code:
```ts
export default async function ({req}: HandlerParams) {
  const response_to_be_cached = new Response('example_response');

  const cache = new LocalCache("example_cache");

  await cache.put(req.url.href, response_to_be_cached, {
    maxage: 600
  });

  return response_to_be_cached;
}
```
This will cache the response for 10 minutes. It saves the date in milliseconds to the `expires` header.  
Note that it's not needed to specifically open a CacheStorage before the operation.

#### `async match: Function`
The `match` fucntion queries the cache, and returns it.

*parameters:*
 - `name: string`: the url string, under which the cache has been saved
 - `returnStale?: boolean`: set to `true`, if the function can return the cached response even if the `expires` header is expired.

Example code:
```ts
export default async function ({req}: HandlerParams) {
  const response_to_be_cached = new Response('example_response');

  const cache = new LocalCache("example_cache");

  await cache.match(req.url.href);

  return response_to_be_cached;
}
```

To return the cached version, even if it's stale:
```ts
export default async function ({req}: HandlerParams) {
  const response_to_be_cached = new Response('example_response');

  const cache = new LocalCache("example_cache");

  await cache.match(req.url.href, true);

  return response_to_be_cached;
}
```

#### `async delete: Function`
The `delete` function deletes a cached response.

*parameters:*
 - `name: string`: the url string, under which the cache has been saved

Example code:
```ts
export default async function ({req}: HandlerParams) {
  const response_to_be_cached = new Response('example_response');

  const cache = new LocalCache("example_cache");

  await cache.delete(req.url.href);

  return response_to_be_cached;
}
```

#### `async fromCacheOrDoCustom: Function`
This function uses the given `name` to query a cache, if exists and fresh, then returns it, else uses the `handler` to do a custom task.

*parameters:*
 - `name: string`: the url string, under which the cache has been saved, or will be saved
 - `handler: Function`: the custom handler

Example code:
```ts
export default async function ({req}: HandlerParams) {
  const cache = new LocalCache("example_cache");

  return await cache.fromCacheOrDoCustom(
    req.url.href,
    () => {
      // do your custom logic
      console.log('Doing custom job in handler!');
      
      return new Response('Returning from Handler.');
    }
  );
}
```
Note that `handler` can be `async`.

#### `isStale: Function`
This function uses a given `Response`, checks the `Expires` header, and returns true if it's stale.
```ts
export default async function () {
  const cache = new LocalCache('example_cache');
  const isStale = cache.isStale((await cache.match('cached_data', true))!);

  return new Response(isStale ? "Cached data is stale" : "Cached data is fresh")
}
```

## LocalCacheStorage
The `LocalCacheStorage` class handles the operations with the CacheStorage.

__Constructor parameters:__

 - `name: string`: the name of the CacheStorage

Example code:
```ts
const example_storage = new LocalCacheStorage('example_storage');
await example_storage.open('other_storage_not_example');
```

### Properties
#### `async open: Funtion`
Opens a CacheStorage.

*parameters:*
 - `name?: string`: the name of the storage, the operation will be done on

Example code:
```ts
const example_storage = new LocalCacheStorage("example_storage");
await example_storage.open();
```

#### `async delete: Funtion`
Deletes a CacheStorage.

*parameters:*
 - `name?: string`: the name of the storage, the operation will be done on

Example code:
```ts
const example_storage = new LocalCacheStorage("example_storage");
await example_storage.delete();
```

#### `async has: Funtion`
Checks if the CacheStorage exists with the given name.

*parameters:*
 - `name?: string`: the name of the storage, the operation will be done on

Example code:
```ts
const example_storage = new LocalCacheStorage("example_storage");
await example_storage.has();
```

## DenoKV
Not yet.