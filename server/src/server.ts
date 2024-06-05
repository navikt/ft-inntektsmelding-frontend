import express, { Router } from "express";

import { setupActuators } from "./actuators.js";
import { setupApiProxy } from "./apiProxy.js";
import { errorHandling } from "./errorHandler.js";
import { setupStaticRoutes } from "./frontendRoute.js";
import { verifyToken } from "./tokenValidation.js";

const app = express();
const router = express.Router();

// Restricts the server to only accept UTF-8 encoding of bodies
app.use(express.urlencoded({ extended: true }));

setupActuators(router);
setupActuators(app as Router); // just try hack

app.set("trust proxy", 1);

app.use(verifyToken);

setupApiProxy(router);

// Catch all route, må være sist
app.use(express.static("./public", { index: false }));
setupStaticRoutes(router);

app.use(errorHandling);

app.use("/fp-im-dialog", router);

export default app;
