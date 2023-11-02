import { Server } from "../../server.ts";

/**
 * The supported levels of logs.
 */
type LogLevels = "info" | "warning" | "error";

/**
 * The logs plugin initer function. [Docs](https://3sdf.github.io/nterac-docs/std/logs/#logs)
 * @param server The Server classed object.
 * @param config A Record<string, boolean> typed config containing the keys.
 */
export function logs(server: Server, config?: Record<string, boolean>) {
  let log_rules: Record<string, boolean> = {};

  if (Deno.env.get('NTERAC_LOGS') == 'true') {
    log_rules = {
      all: true
    }
    // server.store['nterac_std_log_rules'] = log_rules;
    return;
  }

  if (config) {
    log_rules = config;
    // server.store['nterac_std_log_rules'] = log_rules;
  }
  
  const env = Deno.env.toObject();
  for (const key in env) {
    if (key.startsWith('NTERAC_LOGS_')) {
      log_rules[key] = !!env[key];
    }
  }

  // server.store['nterac_std_log_rules'] = log_rules;
  return;
}

/**
 * The function, which uses the config to log or to not log out the given log. [Docs](https://3sdf.github.io/nterac-docs/std/logs/#logger)
 * @param store The store properly containing the config.
 * @param logId The key of the log in the config.
 * @param log The message to log out.
 * @param level The level of the log.
 */
export function logger(logs: Record<string, boolean>, logId: string, log: unknown, level?: LogLevels) {
  const env = Deno.env.toObject();
  const logIdEnvString = logId.replaceAll('.', '_');
  
  // check invidually and check env
  // who tf does    == true. lol me
  if (logs?.[logId] == true && (env[logIdEnvString] == 'true' || !env[logIdEnvString])) {
    logInLevel(level || "info")(Deno.inspect({log, logId}));
    return;
  }
  
  // check if all is set to true and isn't turned off from env
  if (logs?.all && (env[logIdEnvString] == 'true' || !env[logIdEnvString])) {
    logInLevel(level || "info")(Deno.inspect({log, logId}));
    return;
  }


  if (env[logIdEnvString] == 'true') {
    logInLevel(level || "info")(Deno.inspect({log, logId}));
    return;
  }
}

function logInLevel(level: LogLevels) {
  if (level == "info") {
    return console.info;
  }

  if (level == "warning") {
    return console.warn;
  }

  if (level == "error") {
    return console.error;
  }

  return console.log;
}