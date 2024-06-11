import { Router } from "express";

export function setupActuators(router: Router) {
  router.get("/internal/health/isAlive", (request, response) => {
    response.send({
      status: "UP",
    });
  });
  console.log("Liveness available on /internal/health/isAlive");

  router.get("/internal/health/isReady", (request, response) => {
    response.send({
      status: "UP",
    });
  });
  console.log("Readiness available on /internal/health/isReady");
}
