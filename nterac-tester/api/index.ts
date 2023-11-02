import { RES } from "nterac/std/http/mod.ts";

export function GET () {
  return new RES('GET method').send();
}

export function POST () {
  return new RES('POST method').send();
}

export default function (req, ctx) {
  return new RES({
    method: req.method,
    ctx: {...ctx}
  }).type('json').send();
}

// export async function middleware (req, ctx) {
//   return await ctx.next();
// }