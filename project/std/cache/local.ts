/**
 * The class to simplify interacting with the Deno Cache API. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#localcache)
 */
export class LocalCache {
  /**
   * Creates a new LocalCache classed object. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#localcache)
   * @param storagename The name of the CacheStorage the operations will be done on.
   */
  constructor (storagename: string) {
    this.storagename = storagename;
  }
  storagename: string;
  /**
   * Saving a cache. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#properties)
   * @param name A valid URL href under which the cache will be saved.
   * @param value The Response object to be cached.
   * @param options The LocalCacheOptions to configure the maxage or the expiration date of the cache.
   */
  async put (name: string, value: Response, options?: LocalCacheOptions) {
    if (options?.expires || options?.maxage) {
      let expriration_date = options.expires;
      if (options.maxage) {
        // 1sec == 1000ms
        expriration_date = new Date(Date.now() + (options.maxage * 1000));
      }

      expriration_date?.toString() && value.headers.set('expires', expriration_date?.toString());
    }

    return (await new LocalCacheStorage(this.storagename).open()).put(new URL(name), value);
  }
  /**
   * Deleting a cache from the storage. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#properties)
   * @param name The valid URL href under which the cache have been saved.
   * @returns A boolean indicating success.
   */
  async delete (name: string) {
    return (await new LocalCacheStorage(this.storagename).open()).delete(new URL(name));
  }
  /**
   * Querying a cache. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#properties)
   * @param name The valid URL href under which the cache have been saved.
   * @param returnStale A boolean indicating if the saved Response should be returned even if it's expired.
   * @returns The the cached Response or undefined.
   */
  async match (name: string, returnStale?: boolean) {
    const cached = await (await new LocalCacheStorage(this.storagename).open()).match(new URL(name));

    if (!cached) {
      return cached;
    }

    if (!cached.headers.get('expires')) {
      // no expires header () => valid for infinity
      return cached;
    }

    if (Number(Date.parse(cached.headers.get('expires')!)) >= Date.now()) {
      // cache is not expired
      return cached;
    }

    if (returnStale) {
      return cached;
    }

    return undefined;
  }
  /**
   * A function to do things based on a cache's existence. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#properties)
   * @param name The valid URL href under which the cache have been saved.
   * @param handler The task to do if cache does not exist.
   * @returns The cache or the handler's return.
   */
  async fromCacheOrDoCustom (name: string, handler: Function) {
    const match = await this.match(name);
    if (match) {
      return match;
    } else {
      return await handler();
    }
  }
  /**
   * A function that gets a Response and returns a boolean indicating if the response is stale based on the Expires header.
   * @param res The Response the operation will be done on.
   */
  isStale (res: Response) {
    return Number(Date.parse(res.headers.get('expires')!)) <= Date.now();
  }
}

/**
 * Interacting with the CacheStorage. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#localcachestorage)
 */
export class LocalCacheStorage {
  /**
   * Creates a LocalCacheStorage classed object. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#localcachestorage)
   * @param name The name of the CacheStorage the operations will be done on.
   */
  constructor (name: string) {
    this.name = name;
  }
  name: string;
  /**
   * Opening a new CacheStorage. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#properties-1)
   * @returns The Cache object.
   */
  async open () {
    return await caches.open(this.name)
  }
  /**
   * Deleting a CacheStorage. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#properties-1)
   * @returns A boolean indicating success.
   */
  async delete () {
    return await caches.delete(this.name);
  }
  /**
   * Querying a CacheStorage. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#properties-1)
   * @returns A boolean indicating the existence of the given CacheStorage.
   */
  async has () {
    return await caches.has(this.name);
  }
}

/**
 * The caching options of LocalCache. [Docs](https://3sdf.github.io/nterac-docs/std/cache/#localcache)
 */
interface LocalCacheOptions {
  maxage?: number;
  expires?: Date;
}