import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/refusjon-omsorgspenger/$organisasjonsnummer");

export const useInnloggetBruker = () => {
  const routeData = route.useLoaderData();

  if (!routeData?.innloggetBruker) {
    throw new Error(
      "useInnloggetBruker kan kun brukes på /refusjon-omsorgspenger routes",
    );
  }
  if (!routeData.innloggetBruker) {
    throw new Error("Innlogget bruker ikke funnet");
  }
  return routeData.innloggetBruker;
};
