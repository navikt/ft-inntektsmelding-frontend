import { createFileRoute, getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/agi");

export const Route = createFileRoute("/agi/")({
  component: () => {
    const search = route.useSearch();
    const navigate = route.useNavigate();

    return navigate({ to: "/agi/1", search, replace: true });
  },
});
