---
title: Clone Template
---

This guide will use the [official nterac template](https://github.com/3sdf/nterac-template/).

## 1. Clone a template
Run the `deno run -A -r https://nterac.deno.dev` command in an empty directory.  
*This won't create any folders, so if it's ran in the `new-nterac-project` folder, then the `main.ts` is `new-nterac-project/main.ts`.*  
__All files will be overwrited, where there's a name confliction.__

## 1.5. Updating version, discover
If you are new to Deno and use VS Code, you might wanna use the [official Deno language server](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno).

### Updating version
The template might be "outdated", so the `deno.json`'s nterac import might need to be updated to the [latest version](https://deno.land/x/nterac/).

### Discover
The template comes with
 - a `.nterac` folder containing scripts for running the project
 - a standard `api` folder
 - an empty `.env` file
 - a `.gitignore` file
 - a `deno.json` file
 - an `exportmap.ts` file
 - a `main.ts` file

You can see the `Start From Scratch` for more or see for yourself what they do.

## 2. Start coding
Create routes in the `api` folder, and run with the `deno task dev` or `deno task preview` command.