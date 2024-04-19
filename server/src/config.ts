import { requireEnvironment } from "@navikt/backend-for-frontend-utils";

const proxy = {
  apiScope: requireEnvironment("API_SCOPE"),
  apiUrl: requireEnvironment("API_URL"),
};

const app = {
  nodeEnv: requireEnvironment("NODE_ENV"),
  host: requireEnvironment("EXPRESS_HOST"),
  port: Number(requireEnvironment("EXPRESS_PORT")),
};

export default { proxy, app };
