import path from "node:path";

import {
  buildCspHeader,
  fetchDecoratorHtml,
} from "@navikt/nav-dekoratoren-moduler/ssr/index.js";
import { addLocalViteServerHandler } from "@navikt/vite-mode";
import express, { Express } from "express";

import config from "./config.js";

const csp = await buildCspHeader({}, { env: config.app.env });

export function setupStaticRoutes(router: Express) {
  router.use(express.static("./public", { index: false }));
  // When deployed, the built frontend is copied into the public directory. If running BFF locally the index.html will not exist.
  const spaFilePath = path.resolve("./public", "index.html");

  router.get("*", (request, response, next) => {
    response.setHeader("Content-Security-Policy", csp);
    return next();
  });

  // Only add vite-mode to dev environment
  if (config.app.env === "dev") {
    addLocalViteServerHandler(router, {});
  }

  router.get("*", async (request, response) => {
    const viteModeHtml = response.viteModeHtml as string;

    if (viteModeHtml) {
      return response.send(await injectViteModeHtml(viteModeHtml));
    }

    const html = await injectDecorator(spaFilePath);

    return response.send(html);
  });
}

async function injectViteModeHtml(html: string) {
  const dekoratørFragmenter = await fetchDecoratorHtml({
    env: config.app.env,
    params: { context: "arbeidsgiver", simple: true, logoutWarning: true },
  });

  return ``;
}
