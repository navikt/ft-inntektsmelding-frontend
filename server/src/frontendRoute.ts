import path from "node:path";

import {
  buildCspHeader,
  fetchDecoratorHtml,
  injectDecoratorServerSide,
} from "@navikt/nav-dekoratoren-moduler/ssr/index.js";
import { addLocalViteServerHandler } from "@navikt/vite-mode";
import express, { Express } from "express";

import config from "./config.js";

const csp = await buildCspHeader({}, { env: config.app.env });
const dekoratørProps = {
  env: config.app.env,
  params: { context: "arbeidsgiver", simple: true, logoutWarning: true },
} as const;

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
    const viteModeHtml = response.viteModeHtml;

    if (viteModeHtml) {
      return response.send(await injectViteModeHtml(viteModeHtml));
    }

    const html = await injectDecoratorServerSide({
      filePath: spaFilePath,
      ...dekoratørProps,
    });

    return response.send(html);
  });
}

async function injectViteModeHtml(html: string) {
  const {
    DECORATOR_HEADER,
    DECORATOR_HEAD_ASSETS,
    DECORATOR_SCRIPTS,
    DECORATOR_FOOTER,
  } = await fetchDecoratorHtml(dekoratørProps);

  return [
    DECORATOR_HEADER,
    DECORATOR_HEAD_ASSETS,
    DECORATOR_SCRIPTS,
    html,
    DECORATOR_FOOTER,
  ].join("");
}
