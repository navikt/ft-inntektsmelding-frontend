import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/refusjon-omsorgspenger-arbeidsgiver");

export const useOpplysninger = () => {
  const routeData = route.useLoaderData();

  if (!routeData?.opplysninger) {
    throw new Error(
      "useOpplysninger kan kun brukes på /refusjon-omsorgspenger-arbeidsgiver routes",
    );
  }
  return routeData.opplysninger;
};
