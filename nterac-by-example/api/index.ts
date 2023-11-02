import { RES } from "nterac/std/http/mod.ts";

export default function ({req}) {
  console.log(req.url.pathname);

  return new RES('Hello NTERAC!').send();
}