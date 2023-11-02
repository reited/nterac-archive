/**
 * A recursive function to find the correct api module path.
 * @param route The remaining route to process.
 * @param dir The starting directory in Deno.cwd().
 * @returns The `found`: the string /${@param dir}/...; the `dr_ctx`: the dynamic route context; the `err`: contains the possible error. 
 */
export async function pathfinder(pathname: string, dir: string, dr_ctx?: Record<string, string>): Promise<{ found?: string, dr_ctx?: Record<string, string>, err?: string }> {
  if (pathname.endsWith('/')) {
    pathname += 'index';
  }
  if (!pathname.endsWith('.ts')) {
    pathname += '.ts';
  }
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  const context = pathname.split('/')[0];
  
  let found = null;
  if (!dr_ctx) {
    dr_ctx = {};
  }

  for await (const element of Deno.readDir(`${Deno.cwd()}${dir}`)) {
    // found the directory
    if (pathname.split('/').length > 1 && element.isDirectory && element.name == context) {
      // console.log(`choosing static dir: ${element.name}; context: ${context}; length: ${pathname.split('/').length}`, pathname.split('/'));
      
      return await pathfinder(pathname.replace(context, ''), `${dir}${context}/`, dr_ctx);
    }

    // found the dynamic directory
    if (pathname.split('/').length > 1 && element.isDirectory && element.name.match(/\[.*\]/)) {
      // console.log(`choosing dynamic dir: ${element.name}; context: ${context}; length: ${pathname.split('/').length}`, pathname.split('/'));

      dr_ctx[element.name.match(/\[(.*)\]/)?.[1]!] = context;
      return await pathfinder(pathname.replace(context, ''), `${dir}${element.name}/`, dr_ctx);
    }

    // found the static route file
    if (pathname.split('/').length == 1 && element.isFile && element.name == context) {
      // console.log(`choosing static file: ${element.name}; context: ${context}; length: ${pathname.split('/').length}`, pathname.split('/'));

      found = `${dir}${element.name}`;
      // found = `${element.name}`;
      break;
    }

    // found the dynamic route
    if (pathname.split('/').length == 1 && element.isFile && element.name.match(/\[.*\]\.ts/)) {
      // console.log(`choosing dynamic file: ${element.name}; context: ${context}; length: ${pathname.split('/').length}`, pathname.split('/'));

      // storing in dynamic route ctx and getting rid of the .ts extension
      dr_ctx[element.name.match(/\[(.*)\]/)?.[1]!] = context.slice(0, context.length - 3);
      found = `${dir}${element.name}`;
      // found = `${element.name}`;
      break;
    }
  }

  if (found == null) {
    return { err: "NTERAC_404_API_MODULE" };
  }

  // console.log(dr_ctx);
  // console.log(found);
  
  return { found, dr_ctx };
}

/**
 * Manifest dynamic routes pathfinder.
 * @param pathname The route of the API module. 
 * @returns `found`: the route in the format as used in exportmap.ts; `dr_ctx`: the dynamic route context
 */
export function mfdrpf(pathname: string, manifest: Record<string, object>) {
  // search for dynamic
  // maybe not the best practice to maintain 2 different functions for the almost same purpose
  //                                iterate the whole manifest maybe just for one dynamic route

  let found = null;
  let dr_ctx: Record<string, string> = {};

  for (const key in manifest) {
    if (key.match(/\[.*\]/)) {
      // const regexed_route = RegExp(`^${key.replace(/\[.*\]/, '.*[^/]').replace(/\//g, '\\/')}$`);
      // console.log(regexed_route);
      // const regexed_pathname = pathname.match(regexed_route);
      // console.log(regexed_pathname);

      const pattern = RegExp(`^${key.replace(/\[.[^\[]*\]/g, '.[^\\/]*').replace(/\//g, '\\/')}$`);
      
      const correct = pattern.test(pathname);
      // console.log(key, pattern, pathname, correct);

      if (correct) {
        found = key;

        // gather dynamic routes info
        const pathname_ctxs = pathname.split('/');
        const pattern_ctxs = found.split('/');
        pattern_ctxs.forEach((e, i) => {
          pattern_ctxs[i] = e.match(/\[(.*)\]/)?.[1] || '';
        });

        // console.log(pathname_ctxs, pattern_ctxs);
        
        pattern_ctxs.forEach((e, i) => {
          if (e != '') {
            dr_ctx[e] = pathname_ctxs[i];
          }
        });
        
        break;
      }
    }
  }

  if (found == null) {
    return { err: "NTERAC_404_API_MODULE" };
  }

  return { found, dr_ctx };
}