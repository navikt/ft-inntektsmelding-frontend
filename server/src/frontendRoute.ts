import path from "node:path";

import {
  buildCspHeader,
  injectDecoratorServerSide,
} from "@navikt/nav-dekoratoren-moduler/ssr/index.js";
import cookieParser from "cookie-parser";
import express, { Response, Router } from "express";

import config from "./config.js";

const csp =
  config.app.env === "prod"
    ? await buildCspHeader({}, { env: config.app.env })
    : await buildCspHeader(
        {
          "script-src-elem": ["http://localhost:5173"],
          "connect-src": ["ws://localhost:5173"],
        },
        { env: config.app.env },
      );

export function setupStaticRoutes(router: Router) {
  router.use(express.static("./public", { index: false }));
  // When deployed, the built frontend is copied into the public directory. If running BFF locally the index.html will not exist.
  const spaFilePath = path.resolve("./public", "index.html");

  console.log("Requested static resource");
  console.log("spaFilePath", spaFilePath);

  // Only add vite-mode to dev environment
  if (config.app.env === "dev") {
    addLocalViteServerHandlerWithDecorator(router);
  }

  router.get("*", async (request, response) => {
    console.log("request.url", request.url);
    const html = await injectDecorator(spaFilePath);
    response.setHeader("Content-Security-Policy", csp);

    return response.send(html);
  });
}

function addLocalViteServerHandlerWithDecorator(router: Router) {
  const viteDevelopmentServerPath = path.resolve(".", "vite-dev-server.html");

  router.use(cookieParser());
  router.get("/vite-on", (request, response) => {
    setViteCookie(response, true);
    return response.redirect("/");
  });
  router.get("/vite-off", (request, response) => {
    setViteCookie(response, false);
    return response.redirect("/");
  });
  router.get("*", async (request, response, next) => {
    const localViteServerIsEnabled =
      request.cookies["use-local-vite-server"] === "true";
    if (localViteServerIsEnabled) {
      const html = await injectDecorator(viteDevelopmentServerPath);
      response.setHeader("Content-Security-Policy", csp);

      return response.send(html);
    }
    return next();
  });
}

async function injectDecorator(filePath: string) {
  return injectDecoratorServerSide({
    env: config.app.env,
    filePath,
    params: { context: "arbeidsgiver", simple: true, logoutWarning: true },
  });
}

function setViteCookie(response: Response, cookieValue: boolean) {
  response.cookie("use-local-vite-server", cookieValue, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  });
}
