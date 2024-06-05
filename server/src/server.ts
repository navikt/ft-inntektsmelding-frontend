import express from "express";

import { setupActuators } from "./actuators.js";
import { setupApiProxy } from "./apiProxy.js";
import { errorHandling } from "./errorHandler.js";
import { setupStaticRoutes } from "./frontendRoute.js";
import { verifyToken } from "./tokenValidation.js";

const app = express();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));

// Setup route for actuators before we protect our routes
const actuatorRouter = express.Router();
setupActuators(actuatorRouter);
app.use("/fp-im-dialog", actuatorRouter);

app.set("trust proxy", 1);

app.use(verifyToken);

const protectedRouter = express.Router();

setupApiProxy(protectedRouter);
// Catch all route, må være sist
setupStaticRoutes(protectedRouter);

// TODO: dynamic
app.use("/fp-im-dialog", protectedRouter);

app.use(errorHandling);

export default app;
