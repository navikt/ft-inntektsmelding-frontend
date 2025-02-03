//Bruk kun navn fra taksonomien. Med utgangspunkt i https://github.com/navikt/analytics-taxonomy
import { isDev } from "~/utils.ts";

type EventNamesTaksonomi =
  | "readmore lukket"
  | "readmore åpnet"
  | "switch åpnet"
  | "switch lukket";

export const loggAmplitudeEvent = async ({
  eventName,
  eventData,
}: {
  eventName: EventNamesTaksonomi;
  eventData?: Record<string, string>;
}) => {
  if (!isDev) {
    try {
      // eslint-disable-next-line unicorn/prefer-global-this -- klarer ikke få TS til å bli riktig for globalThis
      window.dekoratorenAmplitude?.({
        origin: "ft-inntektsmelding-frontend",
        eventName,
        eventData,
      });
    } catch {
      /* Vi bryr oss ikke om amplitude logging feiler. Oftest hvis bruker rejecter cookies */
    }
  }
};
