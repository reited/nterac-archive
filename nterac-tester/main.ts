// loading variables from .env
import "https://deno.land/std@0.196.0/dotenv/load.ts";

import { Server } from "nterac/mod.ts";
import { RequestParser, ResponseSigner } from "nterac/std/relays/mod.ts";
import { manifest } from "_/exportmap.ts";

const server = new Server({
  manifest: manifest,
  relays: { beforehandler: RequestParser, afterhandler: ResponseSigner },
});
server.serve({
  port: 8001,
});