import { RES } from "nterac/std/http/mod.ts";

export default function () {
  return new RES('The fs route is demonstrate/notroot.ts\nGo to demonstrate/ to see the difference.').send();
}