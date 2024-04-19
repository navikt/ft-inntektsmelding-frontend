import { Express } from "express";

export function setupActuators(app: Express) {
  app.get("/internal/health/isAlive", (request, response) => {
    response.send({
      status: "UP",
    });
  });
  console.log("Liveness available on /internal/health/isAlive");

  app.get("/internal/health/isReady", (request, response) => {
    response.send({
      status: "UP",
    });
  });
  console.log("Readiness available on /internal/health/isReady");
}
