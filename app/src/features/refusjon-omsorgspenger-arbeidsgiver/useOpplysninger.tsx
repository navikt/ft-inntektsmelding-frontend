import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi(
  "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer",
);

export const useOpplysninger = () => {
  const routeData = route.useLoaderData();

  if (!routeData?.opplysninger) {
    throw new Error(
      "useOpplysninger kan kun brukes på /refusjon-omsorgspenger-arbeidsgiver routes",
    );
  }
  if (!routeData.opplysninger.organisasjonsnummer) {
    throw new Error("Opplysninger ikke funnet");
  }
  return routeData.opplysninger;
};
