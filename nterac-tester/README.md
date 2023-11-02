# NTERAC template

It's starter template for NTERAC.

## Starter

The template contains:
 - the `exportmap.ts`, 
 - a minimal `main.ts`, 
 - a `deno.json` config file, 
 - a empty `.env` file,
 - and the `api` folder with an `index.ts`.

## Updating

To update NTERAC, see the [latest version](https://deno.land/x/nterac) on deno.land. Update the config
```json
{
  "tasks": {
    "start": "deno run --unstable --allow-all main.ts",
    "dev": "deno run --unstable --allow-all .nterac/dev.ts --devmode",
    "preview": "deno run --unstable --allow-all .nterac/preview.ts"
  },
  "imports": {
    "_/": "./",
    "nterac/": "https://deno.land/x/nterac@_some_version_you_might_to_update_/"
  }
}
```
to the latest version's url. After that, you might need to make adjustments in your codebase because if the changes in the codebase.