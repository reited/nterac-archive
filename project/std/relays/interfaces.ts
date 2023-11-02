import { Server } from "../../server.ts";

/**
 * The beforehandler's parameters. [Docs](https://3sdf.github.io/nterac-docs/building-blocks/relays/#beforehandler)
 */
export interface BeforeHandlerParams {
  req: Request;
  info: Deno.ServeHandlerInfo;
  server: Server;
}
/**
 * The object's interface in which format the beforehandler should return. [Docs](https://3sdf.github.io/nterac-docs/building-blocks/relays/#beforehandler)
 */
export interface BeforeHandlerReturns {
  result?: any;
  result_request?: any;
  response?: Response;
}
/**
 * The afterhandler's parameters. [Docs](https://3sdf.github.io/nterac-docs/building-blocks/relays/#afterhandler)
 */
export interface AfterHandlerParams {
  response: Response;
  req?: any;
  bh_result?: any;
  server: Server;
  info: Deno.ServeHandlerInfo;
}
/**
 * The object's interface in which format the afterhandler should return. [Docs](https://3sdf.github.io/nterac-docs/building-blocks/relays/#afterhandler)
 */
export interface AfterHandlerReturns {
  response: Response;
}