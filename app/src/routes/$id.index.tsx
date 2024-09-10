import { createFileRoute, getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/$id");

export const Route = createFileRoute("/$id/")({
  component: () => {
    const params = route.useParams();
    const navigate = route.useNavigate();
    const { eksisterendeInntektsmeldinger } = route.useLoaderData();

    if (eksisterendeInntektsmeldinger[0] === undefined) {
      return navigate({
        from: "/$id",
        to: "/$id/dine-opplysninger",
        replace: true,
      });
    }

    return navigate({ to: "/$id/vis", params, replace: true });
  },
});
