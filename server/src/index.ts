import config from "./config.js";
import server from "./server.js";

const hostName = config.app.host;
const port = config.app.port;

server.listen(port, hostName, () => {
  console.log(`Starting fp-inntektsmelding server at ${hostName}:${port}`);
});
