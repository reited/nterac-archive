/**
 * Parses a Request to a different format. [Docs](https://3sdf.github.io/nterac-docs/std/http/#req)
 */
export class REQ {
  constructor (req: Request) {
    this.OR = req;
    const cookies = req.headers.get('cookie')?.split('; ');
    cookies?.forEach((e: string) => {
      const cookie = e.split('=');
      this.cookies[cookie[0]] = cookie[1];
    });
    this.body = req.body;
    req.headers.forEach((value: string, key: string) => {
      this.headers[key] = value;      
    });
    this.method = req.method;
    this.url = new URL(req.url);
  }
  OR: Request;
  cookies: Record<string, string> = {};
  body: ReadableStream<Uint8Array> | null;
  headers: Record<string, string> = {};
  method: string;
  url: URL;
}