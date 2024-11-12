import { getToken, requestOboToken } from "@navikt/oasis";
import { NextFunction, Request, Response, Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import config from "./config.js";

type ProxyOptions = {
  ingoingUrl: string;
  outgoingUrl: string;
  scope: string;
};

export const setupApiProxy = (router: Router) =>
  addProxyHandler(router, {
    ingoingUrl: "/server",
    outgoingUrl: config.proxy.apiUrl,
    scope: config.proxy.apiScope,
  });

export function addProxyHandler(
  router: Router,
  { ingoingUrl, outgoingUrl, scope }: ProxyOptions,
) {
  router.use(
    ingoingUrl,
    async (request: Request, response: Response, next: NextFunction) => {
      const token = getToken(request);
      if (!token) {
        return response.status(401).send();
      }
      const obo = await requestOboToken(token, scope);
      if (obo.ok) {
        request.headers["obo-token"] = obo.token;
        return next();
      } else {
        console.log("OBO-exchange failed", obo.error);
        return response.status(403).send();
      }
    },
    createProxyMiddleware({
      target: outgoingUrl,
      changeOrigin: true,
      logger: console,
      on: {
        proxyReq: (proxyRequest, request) => {
          const obo = request.headers["obo-token"];
          if (obo) {
            proxyRequest.removeHeader("obo-token");
            proxyRequest.removeHeader("cookie");
            proxyRequest.setHeader("Authorization", `Bearer ${obo}`);
            proxyRequest.setHeader(
              "Nav-Consumer-Id",
              "ftinntektsmelding-frontend",
            );
          } else {
            console.log(
              `Access token var not present in session for scope ${scope}`,
            );
          }
        },
      },
    }),
  );
}
