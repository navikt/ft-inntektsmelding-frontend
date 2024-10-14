import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/$id");

export const useOpplysninger = () => {
  const routeData = route.useLoaderData();

  if (!routeData?.opplysninger) {
    throw new Error("useOpplysninger kan kun brukes på /:id routes");
  }
  return routeData.opplysninger;
};
