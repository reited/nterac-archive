console.log(' > dev.ts running');

// replacing manifest before importing, so there are module not found issues
try {
  (await import(`file://${Deno.cwd()}/exportmap.ts`)).manifest;
} catch (error) {
  console.log(' > replacing manifest');
  
  const encoder = new TextEncoder();

  await Deno.writeFile(`${Deno.cwd()}/exportmap.ts`, encoder.encode('export const manifest: Record<string, any> = {}'))
}

// const p = Deno.run({
//   cmd: ["deno", "run", "--unstable", "--allow-all", "--watch", `${Deno.cwd()}/main.ts`, "--devmode"]
// });
// const status = await p.status();

const command = new Deno.Command(Deno.execPath(), {
  args: ["run", "--unstable", "--allow-all", "--watch", `${Deno.cwd()}/main.ts`, "--devmode"],
  stdout: "piped",
  stderr: "piped",
});

const child = command.spawn();

(async () => {
  for await (const info of child.stdout) {
    const out_text = new TextDecoder().decode(info);
    // console.log(out_text.endsWith('\n'));

    // TextDecoder or something else leaves a '\n' at the end of the string
    // unnecessery line () => leave it out
    console.info(out_text.slice(0, out_text.length - 1));
  }
})();
(async () => {
  for await (const error of child.stderr) {
    const err_text = new TextDecoder().decode(error);
    // console.log(err_text.endsWith('\n'));
    
    // TextDecoder or something else leaves a '\n' at the end of the string
    // unnecessery line () => leave it out
    console.error(err_text.slice(0, err_text.length - 1));
  }
})();