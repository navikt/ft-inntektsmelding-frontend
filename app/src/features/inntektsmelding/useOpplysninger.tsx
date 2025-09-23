import { getRouteApi, useLocation } from "@tanstack/react-router";

export const useOpplysninger = () => {
  const location = useLocation();
  const route = location.pathname.startsWith(`${import.meta.env.BASE_URL}/agi`)
    ? getRouteApi("/agi")
    : getRouteApi("/$id");
  const routeData = route.useLoaderData();

  if (!routeData?.opplysninger) {
    throw new Error("useOpplysninger kan kun brukes på /:id eller /agi routes");
  }
  return routeData.opplysninger;
};
