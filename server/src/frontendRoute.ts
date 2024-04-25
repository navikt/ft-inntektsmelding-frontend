import path from "node:path";

import {
  addLocalViteServerHandler,
  addServeSpaHandler,
} from "@navikt/backend-for-frontend-utils";
import { injectDecoratorServerSide } from "@navikt/nav-dekoratoren-moduler/ssr";
import express, { Express } from "express";
import config from "./config.js";

export function setupStaticRoutes(app: Express) {
  app.use(express.static("./public", { index: false }));

  // When deployed, the built frontend is copied into the public directory. If running BFF locally the directory will not exist.
  const spaFilePath = path.resolve("./public", "index.html");

  addLocalViteServerHandler(app);

  app.get("*", async (request, response) => {
    const html = await injectDecoratorServerSide({
      env: config.app.env,
      filePath: spaFilePath,
      params: { context: "privatperson", simple: true },
    });

    return response.send(html);
  });
  // addServeSpaHandler(app, spaFilePath);
}
