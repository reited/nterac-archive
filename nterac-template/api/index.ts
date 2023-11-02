import { RES } from "nterac/std/http/mod.ts";

export default function () {
  return new RES('Hello NTERAC!').send();
}