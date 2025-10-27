import { getRouteApi, useLocation } from "@tanstack/react-router";

export const useOpplysninger = () => {
  const location = useLocation();
  const route = location.pathname.startsWith("/agi")
    ? getRouteApi("/agi/$id")
    : getRouteApi("/$id");
  const routeData = route.useLoaderData();

  if (!routeData?.opplysninger) {
    throw new Error("useOpplysninger kan kun brukes på /:id eller /agi routes");
  }
  return routeData.opplysninger;
};
