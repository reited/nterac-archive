import { RES } from "nterac/std/http/mod.ts";

export default function ({req}) {
  return new RES('The fs route is demonstrate/index.ts\nGo to demonstrate/notroot to see the difference.').send();
}