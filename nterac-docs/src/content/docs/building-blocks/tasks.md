---
title: Tasks
---
Requirements: 
 - `deno.json` tasks are correctly configured
 ```json
"tasks": {
  "dev": "deno run --unstable --allow-all .nterac/dev.ts",
  "preview": "deno run --unstable --allow-all .nterac/preview.ts"
}
 ```
 - `.nterac` folder with the files from the [template](https://github.com/3sdf/nterac-template/) is presented in the project folder.

On the technical spectrum, `dev` uses dynamic imports, while `preview` works with pre-import-user `exportmap`.

## deno task dev
The `deno task dev` command runs the `.nterac/dev.ts` file.

### Behaviour
If `exportmap.ts` file is missing or doesn't export a `manifest`, it will generate one with the code: 
```ts
export const manifest: Record<string, object> = {}
```

It also uses the `deno --watch` flag to watch for changes in the directory.  
If any of the file changes, the server should restart, running the latest version of the code.

It also sets the environment variable `NTERAC_DEVMODE` to `true`, which can be also accessible in handlers, etc.

## deno task preview
The `deno task preview` command runs the `.nterac/preview.ts` file.

### Behaviour
It generates `exportmap.ts` file based on the `api` directory.

It doesn't have a built-in file watcher, because it isn't best practice to always regenerate a file, and it can also be a bit slow, if the project has a lot of routes. 