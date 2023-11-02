import { REQ } from "../http/mod.ts";
import { BeforeHandlerParams } from "./mod.ts";

/**
 * Parses the request into another format. [Docs](https://3sdf.github.io/nterac-docs/std/relays/#requestparser)
 * @returns The REQ classed object.
 */
export function RequestParser ({req}: BeforeHandlerParams) {
  const request = new REQ(req);
  return { result_request: request };
}