export const loggAmplitudeEvent = ({
  eventName,
  eventData,
}: {
  eventName: string;
  eventData?: Record<string, string>;
}) => {
  // eslint-disable-next-line unicorn/prefer-global-this -- klarer ikke få TS til å bli riktig for globalThis
  window.dekoratorenAmplitude({
    origin: "ft-inntektsmelding-frontend",
    eventName,
    eventData,
  });
};
