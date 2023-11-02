import { parse } from "https://deno.land/std@0.197.0/path/mod.ts";

async function getApiFolderFiles(extraDir?: string) {
  interface Routes {
    pathname: string;
    filepath: string;
  }
  const routes: Routes[] = [];
  const cwd = Deno.cwd().replaceAll('\\', '/');

  for await (const file of Deno.readDir(`${cwd}/api${extraDir || ''}`)) {
    if (file.isFile) {
      let pathname = '';
      const { name } = parse(file.name)

      if (file.name != 'index.ts') {
        pathname = `${extraDir ? '' : '/'}${extraDir ? extraDir + '/' : ''}${name}`
      }
      else {
        pathname = `${extraDir ? '' : '/'}${extraDir || ''}${extraDir ? '/' : ''}`
      }
    
      routes.push({
        filepath: `./api${extraDir || ''}/${file.name}`,
        pathname: `${pathname}`
      });
    }
    if (file.isDirectory) {
      const extraDirFiles = await getApiFolderFiles((extraDir || '') + '/' + file.name);
      routes.push(...extraDirFiles);
    }
  }
  
  return routes;
}

function generateImportLine(index: number, filepath: string) {
  return `import * as $${index} from "${filepath}";\n`;
}

function generateManifestLine(index: number, pathname: string) {
  return `  "${pathname}": $${index},\n`;
}

/**
 * Generates the exportmap.ts file. [Docs](https://3sdf.github.io/nterac-docs/quick-start/start-from-scratch/#updating-manifest)
 */
export async function generateExportMap() {
  const routes = await getApiFolderFiles();

  let routestext = '';
  let manifesttext = '';
  routes.map(({filepath, pathname}, i) => {
    routestext += generateImportLine(i, filepath);
    manifesttext += generateManifestLine(i, pathname);
  });

  const encoder = new TextEncoder();
  const text = 
`// AUTOMATICALLY GENERATED
// DO NOT EDIT, IF NOT NECESSARY

${routestext}
export const manifest: Record<string, object> = {
${manifesttext}}
`;

  await Deno.writeFile(`${Deno.cwd()}/exportmap.ts`, encoder.encode(text));
}