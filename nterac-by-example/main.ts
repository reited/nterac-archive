// loading variables from .env
import "https://deno.land/std@0.196.0/dotenv/load.ts";

// importing the server from mod.ts
import { Server } from "nterac/mod.ts";

// importing relays from std/relays
import { RequestParser, ResponseSigner } from "nterac/std/relays/mod.ts";

// importing the manifest from the exportmap
import { manifest } from "_/exportmap.ts";

// importing the std/logs plugin, and the custom configuration
import { logs } from "nterac/std/logs/mod.ts";
import { rules } from "_/logrules.ts";

const server = new Server({
  // the manifest is the compulsary parameter
  manifest: manifest,

  // relays are not compulsary
  relays: { beforehandler: RequestParser, afterhandler: ResponseSigner },

  // plugins are also optional
  plugins: [
    (srv: Server) => logs(srv, rules)
  ]
});

// after the server initalized, the serve function is invoked, and the server is now up and running
server.serve();