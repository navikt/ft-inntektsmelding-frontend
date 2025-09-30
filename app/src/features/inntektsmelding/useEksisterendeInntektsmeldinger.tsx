import { getRouteApi, useLocation } from "@tanstack/react-router";

export const useEksisterendeInntektsmeldinger = () => {
  const location = useLocation();

  const erAGI = location.pathname.startsWith("/agi");

  const route = erAGI ? getRouteApi("/agi") : getRouteApi("/$id");
  const routeData = route.useLoaderData();

  if (!routeData?.eksisterendeInntektsmeldinger) {
    throw new Error(
      "useEksisterendeInntektsmeldinger kan kun brukes på /:id eller /agi routes",
    );
  }
  return routeData.eksisterendeInntektsmeldinger;
};
