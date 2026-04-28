import "dotenv/config";
import { createServer, ServerResponse } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const port = Number(process.env.PORT ?? "4173");

interface DemoState {
  trace: unknown | null;
  execution: unknown | null;
  gap: unknown | null;
  compute: unknown | null;
  artifact: unknown | null;
  validation: unknown | null;
  improvement: unknown | null;
  validated: unknown | null;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
    if (url.pathname === "/") {
      await sendFile(response, "web/index.html", "text/html; charset=utf-8");
      return;
    }
    if (url.pathname === "/styles.css") {
      await sendFile(response, "web/styles.css", "text/css; charset=utf-8");
      return;
    }
    if (url.pathname === "/app.js") {
      await sendFile(response, "web/app.js", "text/javascript; charset=utf-8");
      return;
    }
    if (url.pathname === "/api/state") {
      const state = await readState();
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(state, null, 2));
      return;
    }
    response.writeHead(404);
    response.end("not found");
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.stack : String(error));
  }
});

server.listen(port, () => {
  console.log(`OpenGap demo UI: http://localhost:${port}`);
});

async function sendFile(response: ServerResponse, file: string, contentType: string): Promise<void> {
  const body = await readFile(path.join(root, file));
  response.writeHead(200, { "content-type": contentType });
  response.end(body);
}

async function readState(): Promise<DemoState> {
  return {
    trace: await latestJson(".opengap/traces"),
    execution: await latestJson(".opengap/executions"),
    gap: await latestJson(".opengap/gaps"),
    compute: await latestJson(".opengap/compute"),
    artifact: await latestJson(".opengap/artifacts"),
    validation: await latestJson(".opengap/validations"),
    improvement: await latestJson(".opengap/improvements"),
    validated: await latestValidated()
  };
}

async function latestJson(relativeDir: string): Promise<unknown | null> {
  const dir = path.join(root, relativeDir);
  const files = await readdir(dir).catch(() => []);
  if (files.length === 0) return null;
  const newest = files.sort().at(-1);
  if (!newest) return null;
  return JSON.parse(await readFile(path.join(dir, newest), "utf8"));
}

async function latestValidated(): Promise<unknown | null> {
  const dir = path.join(root, ".opengap", "validated");
  const entries = await readdir(dir).catch(() => []);
  const newest = entries.sort().at(-1);
  if (!newest) return null;
  return JSON.parse(await readFile(path.join(dir, newest, "index.json"), "utf8"));
}

export const serverUrl = pathToFileURL(path.join(root, "web", "index.html")).toString();
