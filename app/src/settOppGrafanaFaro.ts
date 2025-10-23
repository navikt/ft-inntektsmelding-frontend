import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

if (import.meta.env.PROD) {
  initializeFaro({
    url: globalThis.location.hostname.includes(".intern.dev.nav")
      ? "https://telemetry.ekstern.dev.nav.no/collect"
      : "https://telemetry.nav.no/collect",
    app: {
      name: lagGrafanaAppName(),
    },
    instrumentations: [
      ...getWebInstrumentations({ captureConsole: true }),
      new TracingInstrumentation(),
    ],
  });
}

function lagGrafanaAppName() {
  if (import.meta.env.BASE_URL === "/k9-im-dialog") {
    return "k9-inntektsmelding-frontend";
  }

  throw new Error(
    `Vite BASE_URL(${import.meta.env.BASE_URL}) er ikke satt, eller har ugyldig verdi`,
  );
}
