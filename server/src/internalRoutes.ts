import { getToken } from "@navikt/oasis";
import { Express } from "express";
import { jwtDecode } from "jwt-decode";

export const internalRoutes = (app: Express) => {
  app.get("/server/userinfo", (request, response) => {
    const token = getToken(request);
    if (!token) {
      return response.status(401).send();
    }

    const decodedToken = jwtDecode<{
      name: string;
    }>(token);

    console.log(decodedToken);

    return response.json({ name: decodedToken.name });
  });
};
