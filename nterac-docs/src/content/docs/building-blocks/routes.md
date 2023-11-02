---
title: Routes
---

nterac uses file-system based routing, which means, that the position in the file-system will determine one's route.  
All routes must be defined in the `api` folder. Routes are simple TypeScript file. The server will serve these without the `api` in the url.

## Root routes
Root files are named `index.ts` and serve the `<directory>/`.
```
api/index.ts => /
api/example/index.ts => /example/
```

## Named routes
Another option is to create a TypeScript file and name it anything.
```
api/example.ts => /example
api/example/sub.ts => /example/sub
```

## Dynamic routes
Dynamic routes are TypeScript files anything, following this pattern: `[...]`. The folders can also be dynamic, just like files.
*The asterisk (\*) is used as a wildcard, represents any string.*
```
api/[example]/index.ts => /*/
api/[example].ts => /*
```
Dynamic folders can contain static files, static folders can contain dynamic folders and routes.
```
api/demo/[example]/[sub].ts => /demo/*/*
api/[example]/sub/[demo].ts => /*/sub/*
```
See more in handlers on how to use `dr_ctx`.

To avoid conflicts, named routes shouldn't be used at the same directory level as a dynamic route.