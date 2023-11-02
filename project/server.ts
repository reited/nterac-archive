import { mfdrpf, pathfinder } from "./pathfinder.ts";
import { RES } from "./std/http/mod.ts";
import { logger } from "./std/logs/mod.ts";

/**
 * The parameters of the server constructor. [Docs](https://3sdf.github.io/nterac-docs/quick-start/start-from-scratch/#create-a-server)
 */
interface ServerOptions {
  manifest: Record<string, object>;
  relays?: Relays;
  // plugins?: [Function]
  logs?: Record<string, boolean>;
  events?: EventsListener[];
  routefolder?: string;
}

/**
 * The parameters of the serve function. [Docs](https://3sdf.github.io/nterac-docs/reference/server/#serve)
 */
interface ServeOptions {
  port?: number;
  hostname?: string;
  signal?: AbortSignal;
}

/**
 * The relays interface used in ServerOptions. [Docs](https://3sdf.github.io/nterac-docs/building-blocks/relays/#usage)
 */
interface Relays {
  beforehandler?: Function;
  afterhandler?: Function;
}

interface ServerRelays {
  beforehandler?: {
    module?: Function;
    return?: any;
  };
  afterhandler?: Function
}

/**
 * The parameters of the handlers. [Docs](https://3sdf.github.io/nterac-docs/building-blocks/handlers/)
 */
export interface HandlerParams {
  req: Request | any;
  ctx: HandlerCtxParams
}
interface HandlerCtxParams {
  bh_result?: any;
  server: Server;
  info: Deno.ServeHandlerInfo;
  params?: {
    route?: Record<string, string>;
    middleware?: Record<string, string>;
  }
}

/**
 * The parameters of the middlewares. [Docs](https://3sdf.github.io/nterac-docs/building-blocks/middlewares/)
 */
export interface MiddlewareParams {
  req: Request | any;
  ctx: MiddlewareCtxParams;
}
export interface MiddlewareCtxParams {
  bh_result?: any;
  server: Server;
  info: Deno.ServeHandlerInfo;
  params?: {
    route?: Record<string, string>;
  }
  next: Function;
}

export type Handler = (req: Request | any, ctx: HandlerCtxParams) => Promise<Response> | Response;
export type Middleware = (req: Request | any, ctx: MiddlewareCtxParams) => Promise<Response> | Response | void;

/**
 * The interface of the Events listener object.
 */
interface EventsListener {
  name: string;
  handler: EventsListenerHandler;
}
type EventsListenerHandler = (arg0: unknown[]) => any;

/**
 * The class providing the event functionality of nterac.
 */
class Events {
  constructor (listeners?: EventsListener[]) {
    listeners && this.listeners.push(...listeners);
  }
  listeners: EventsListener[] = [];
  add (name: string, handler: EventsListenerHandler) {
    // this.listeners.push({
    //   name: name,
    //   handler: handler
    // });
    const itemIndex = this.listeners.findIndex((e) => e.name == name);
    this.listeners.splice(itemIndex, 1, {name: name, handler: handler})
  }
  remove (name: string) {
    const itemIndex = this.listeners.findIndex((e) => e.name == name);
    this.listeners.splice(itemIndex);
  }
  async trigger (name: string, handlerparams?: any) {
    return await this.listeners.find((e) => e.name == name)?.handler(handlerparams);
  }
  has (name: string) {
    return this.listeners.findIndex((e) => e.name == name) != -1;
  }
}

/**
 * The class providing the core functionality of nterac. [Docs](https://3sdf.github.io/nterac-docs/reference/server/)
 */
export class Server {
  importer = async (route: string): Promise<{ module: object, dr_ctx?: Record<string, string> } | { err: string }> => {
    // only between dev mode dynamic imports or use this.manifest
    if (this.devmode) {
      const { found, err, dr_ctx } = await pathfinder(route, `/api/`);

      if (err) {
        return { err };
      }

      const module = await import(`file://${Deno.cwd()}/${found}`);
      return { module, dr_ctx };
    } else {
      // if static found
      if (this.manifest[route]) {
        return { module: this.manifest[route] };
      }

      // otherwise search for dynamic
      const { found, dr_ctx, err } = mfdrpf(route, this.manifest);

      if (err) {
        return { err };
      }

      return { module: this.manifest[found!], dr_ctx };
    }
  }
  /**
   * The store, which can be used to do almost anything. [Docs](https://3sdf.github.io/nterac-docs/reference/server/#store)
   */
  store: Record<string, any> = {};
  devmode: boolean = Deno.env.get('NTERAC_DEVMODE') == 'true';
  events: Events = new Events(server_events);
  /**
   * Initing a new Server. [Docs](https://3sdf.github.io/nterac-docs/quick-start/start-from-scratch/#create-a-server)
   * @param options The ServerOptions object.
   */
  constructor(options: ServerOptions) {
    Deno.env.set('NTERAC_DEVMODE', Deno.args.includes('--devmode').toString());
    this.devmode = Deno.env.get('NTERAC_DEVMODE') == 'true';

    this.logs = options.logs || {};
    logger(this.logs, 'server.constructor.logs', [" > server.logs", this.logs]);

    this.manifest = options.manifest;
    logger(this.logs, 'server.constructor.manifest', [" > manifest", this.manifest]);

    this.relays.beforehandler = { module: options.relays?.beforehandler };
    this.relays.afterhandler = options.relays?.afterhandler;
    logger(this.logs, 'server.constructor.relays', [" > server.relays", this.relays]);

    options.events?.map((v) => {
      this.events.add(v.name, v.handler);
    });
    logger(this.logs, 'server.constructor.events', [" > server.events", this.events]);

  }
  manifest!: Record<string, object>;
  relays: ServerRelays = {};
  logs: Record<string, boolean> = {};
  /**
   * The function which starts the server. [Docs](https://3sdf.github.io/nterac-docs/reference/server/#serve)
   * @param options The ServeOptions object.
   * @returns A Response object.
   */
  // abortcontroller = new AbortController();
  serve = (options?: ServeOptions) => Deno.serve(
    {
      ...options,
      // signal: this.abortcontroller.signal,
      onListen: () => { console.log(` > nterac server starts at http://${options?.hostname || 'localhost'}:${options?.port || '8000'}`) },
      onError: async (error) => { return await this.events.trigger('server.serve.onerror', {error}) }
    },
    async (req: Request, info: Deno.ServeHandlerInfo) => {
      // logger(this.logs, 'server.serve.request', [" > serve.req", req]);
      const { pathname } = new URL(req.url);

      try {
        if (this.relays.beforehandler?.module) {
          // logger(this.logs, "server.serve.relays.beforehandler", " > relays beforehandler running")
          const { result, result_request, response } = await this.relays.beforehandler.module({req, info, server: this});
          this.relays.beforehandler.return = {
            result_request, result
          }
          // logger(this.logs, 'server.serve.relays.beforehandler.result', [" > relays.beforehandler result", { result, result_request, response }]);
          if (response) {
            // logger(this.logs, 'server.serve.response', [" > serve.response", response]);
            return response;
          }
        }
      } catch (error) {
        return await this.events.trigger('server.serve.beforehandler', {error, pathname});
      }

      const imported: any = (await this.importer(pathname));
      if (imported.err) {
        return await this.events.trigger('server.import.error', {pathname});
      }
      
      try {
        let response;
        const input: HandlerParams = { req: this.relays.beforehandler?.return?.result_request || req, ctx: { bh_result: this.relays.beforehandler?.return?.result, server: this, info, params: { route: imported.dr_ctx }}};
        logger(this.logs, 'server.serve.input', [" > serve.input", input]);

        if (imported.module.middleware) {
          logger(this.logs, 'server.serve.middleware', " > middleware running");
          response = await imported.middleware(input.req, {...input.ctx, next: async (data?: any) => response = await imported.module[req.method]?.(input.req, input.ctx) || await imported.module.default(input.req, input.ctx)});
          if (!response) {
            response = await imported.module[req.method]?.(input.req, input.ctx) || await imported.module.default(input.req, input.ctx);
          }
          logger(this.logs, 'server.serve.middleware.result', [" > serve.middleware result", response]);
        } else {
          logger(this.logs, 'server.serve.middleware', " > no middleware function defined");
          response = await imported.module[req.method]?.(input.req, input.ctx) || await imported.module.default(input.req, input.ctx);
        }

        if (this.relays.afterhandler) {
          logger(this.logs, 'server.serve.afterhandler', " > afterhandler running");
          const afterhandler_response = await this.relays.afterhandler({...input, response});
          logger(this.logs, 'server.serve.afterhandler.result', [" > relays.afterhandler result", afterhandler_response]);
          response = afterhandler_response;
        }

        logger(this.logs, 'server.serve.response', [" > serve.response", response]);
        return response;
      } catch (error) {
        return await this.events.trigger('server.error.response', {error, pathname});
      }
    }
  )
}

const server_events: EventsListener[] = [
  {
    name: 'server.response.error',
    handler: ({error, pathname}) => {
      console.error(error);

      return new RES({error: 'Internal Server Error', route: pathname}, 500).type('json').send();
    }
  },
  {
    name: 'server.serve.onerror',
    handler: ({error}) => {
      console.error(error);

      return new Response('Internal Server Error', {
        status: 500
      });
    }
  },
  {
    name: 'server.serve.beforehandler.error',
    handler: ({error, pathname}) => {
      console.error(error);

      return new RES({error: 'Internal Server Error', route: pathname}, 500).type('json').send();
    }
  },
  {
    name: 'server.import.error',
    handler: ({pathname}) => {
      return new RES({error: 'API module not found.', route: pathname}, 404).type('json').send();
    }
  }
]