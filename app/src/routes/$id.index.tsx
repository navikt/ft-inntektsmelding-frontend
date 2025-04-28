import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$id/")({
  loader: async ({ params, parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;
    const eksisterendeInntektsmeldinger =
      loaderData?.eksisterendeInntektsmeldinger;
    if (!eksisterendeInntektsmeldinger) {
      throw new Error("No loader data");
    }
    if (eksisterendeInntektsmeldinger[0] === undefined) {
      redirect({
        to: "/$id/dine-opplysninger",
        params,
        replace: true,
        throw: true,
      });
    } else {
      redirect({
        to: "/$id/vis",
        params,
        replace: true,
        throw: true,
      });
    }
  },
  component: () => null,
});
