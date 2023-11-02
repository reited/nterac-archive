type RESType = 'json' | 'text' | 'xml';
const RESTypeDictionary: Record<RESType | string, string> = {
  'json': 'application/json',
  'text': 'text/plain',
  'xml': 'application/xml'
}

interface RESCookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  maxage?: number;
  expires?: Date;
  secure?: "true" | "false";
  httponly?: "true" | "false";
  samesite?: "Strict" | "Lax" | "None";
  DELETE?: boolean;
}

type RESHeaders = Record<string, string>

/**
 * Provides better tooling for responses. [Docs](https://3sdf.github.io/nterac-docs/std/http/#res)
 */
export class RES {
  data: any
  status: number
  constructor (data: any, status?: number) {
    this.data = data;
    this.status = status || 200;
    // this.res_headers = {};
  }
  res_headers: RESHeaders = {}
  type(type: RESType | string) {
    this.res_headers['content-type'] = RESTypeDictionary[type] || type;
    if (type == 'json') {
      this.data = JSON.stringify(this.data);
    }
    return this;
  }
  headers(headers: RESHeaders) {
    for (const key in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, key)) {
        if (headers[key]) {
          this.res_headers[key] = headers[key];
        }
      }
    }

    return this;
  }
  cookie(cookie: RESCookie) {
    const cookiestring = `${cookie.name}=${cookie.value}; Path=${cookie.path || '/'}; Domain=${cookie.domain || ''}; ${cookie.expires ? `Expires=${cookie.expires};` : `Max-Age=${cookie.DELETE ? 0 : cookie.maxage || 'session'};`} SameSite=${cookie.samesite || 'None'}; Secure=${cookie.secure || "false"}; HttpOnly=${cookie.httponly || "false"}`;

    this.headers({'set-cookie': cookiestring});

    return this;
  }
  send() {
    return new Response(this.data, {
      status: this.status,
      headers: this.res_headers
    });
  }
  redirect() {
    const res_url = new URL(this.data);
    
    !this.status.toString().startsWith('3') ? this.status = 301 : '';

    this.headers({'location': res_url.href});

    return this.send();
  }
}