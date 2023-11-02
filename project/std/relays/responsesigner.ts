import { AfterHandlerParams } from "./mod.ts";

/**
 * Signs the response with a header 'server: nterac'. [Docs](https://3sdf.github.io/nterac-docs/std/relays/#responsesigner)
 * @returns The Response object.
 */
export function ResponseSigner ({response}: AfterHandlerParams) {
  response.headers.set('server', 'nterac');
  return response;
}