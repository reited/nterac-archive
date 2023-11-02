---
title: std/http
---

```ts
import { ... } from "nterac/std/http/mod.ts"
```

## REQ

Only stores the most common request properties.

__Constructor parameters:__

 - `req: Request`: the request to be parsed

### Properties
  - `cookies: Record<string, string>`: the cookies parsed into an object. Access it simply: `req.cookies[_desired_name_]`.
  - `headers: Record<string, string>`: the headers parsed into an object. Access it simply: `req.headers[_desired_name_]`.
  - `url: URL`: the url parsed into a `URL` object.
  - `method: string`: the method of the request.
  - `body: ReadableStream<Uint8Array> | null`: the body of the request.
  - `OR: Request`: the original, full request.


## RES

A class, focusing on simplifying the way of sending common type of responses.

This class might change in the future.

__Constructor parameters:__

 - `data: any`: the data to be sent to the client.  
 - `status?: number`: the status code of the response. Default: `200`.

### Properties
#### `type: Function`
Sets the `content-type` header to the one provided.
 
*parameters:* 
 - `type: type: RESType | string`: the type of the content

There are available shortcuts:
```ts
type RESType = 'json' | 'text' | 'xml';
const RESTypeDictionary: Record<RESType | string, string> = {
  'json': 'application/json',
  'text': 'text/plain',
  'xml': 'application/xml'
}
```
This means, that if the parameter `type` is equals to `json`, than the `content-type` header's value will be `application/json`, and so on.
```ts
export default function () {
  return new RES({message: 'Hello world!'}).type('json').send();
}
```
But any other `content-type` can be provided as the `type` parameter, the code will simply use that, if it's not defined in the shortcuts.
```ts
export default function () {
  return new RES('console.log("Hi!")').type('application/javascript').send();
}
```

#### `headers: Function`
Inserts the provided object into the response header. If the header somewhere was already set before, then it will overwrite it. Also, it __inserts__ the given headers, not overwrites the whole header object, so the other headers, which were set elsewhere, will be left untouched.

*parameters:*

 - `headers: RESHeaders`: the given headers to set

```ts
type RESHeaders = Record<string, string>
```

Example code:
```ts
export default function () {
  return new RES('Hello world!')
  .headers({
    'server': 'nterac',
    'allow': 'GET, HEAD'
  })
  .send();
}
```

But this works with just one as well:
```ts
export default function () {
  return new RES('Hello world!').headers({ 'server': 'nterac' }).send();
}
```

#### `cookie: Function`
Sets the given cookie as the `set-cookie` header in the response.

*parameters:*

 - `cookie: RESCookie`: the given cookie to set

```ts
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
```
Note, that only the `name` and `value` fields are required.

To delete a cookie, you can either set the `maxage` to `0`, or set the `DELETE` to `true`.

Example code:
```ts
export default function () {
  return new RES('Hello world!')
  .cookie({
    name: 'my-cookie',
    value: 'your-cat',
    maxage: 3600
  })
  .send();
}
```

#### `send: Function`
Returns a web-standard `Response` object, which can be sent back to the client. This function might be unneccessary in the future.

Call it at the end of the `RES` function chain.

#### `redirect: Function`
Returns a web-standard `Response` object, which can be sent back to the client.

It adds the additional headers and statuses to the response.

Call it at the end of the `RES` function chain.

Example code:
```ts
export default function () {
  return new RES('https://example.com', 307).redirect();
}
```
Note that the `data` in this case is a url string. The `status` is not required, it defaults to `301`.