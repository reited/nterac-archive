import { generateExportMap } from "nterac/generate_exportmap.ts";

// generate exportmap before serving preview
console.log(" > generating exportmap");
await generateExportMap();

// const p = Deno.run({
//   cmd: ["deno", "run", "--unstable", "--allow-all", `${Deno.cwd()}/main.ts`]
// });
// const status = await p.status();

const command = new Deno.Command(Deno.execPath(), {
  args: ["run", "--unstable", "--allow-all", `${Deno.cwd()}/main.ts`],
  stdout: "piped",
  stderr: "piped",
});

const child = command.spawn();

(async () => {
  for await (const info of child.stdout) {
    const out_text = new TextDecoder().decode(info);
    // console.log(out_text.endsWith('\n'));

    // TextDecoder or something else leaves a '\n' at the end of the string
    // unnecessary line () => leave it out
    console.info(out_text.slice(0, out_text.length - 1));
  }
})();
(async () => {
  for await (const error of child.stderr) {
    const err_text = new TextDecoder().decode(error);
    // console.log(err_text.endsWith('\n'));
    
    // TextDecoder or something else leaves a '\n' at the end of the string
    // unnecessary line () => leave it out
    console.error(err_text.slice(0, err_text.length - 1));
  }
})();