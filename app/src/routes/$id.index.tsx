import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$id/")({
  loader: async ({ params, parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;
    const eksisterendeInntektsmeldinger =
      loaderData?.eksisterendeInntektsmeldinger;
    if (!eksisterendeInntektsmeldinger) {
      throw new Error("No loader data");
    }
    /*
    Her skal vi sjekke om vi det er agi eller ikke, og redirecte til agi eller vanlig.
    /* */
    // if (true) {
    //   return redirect({
    //     to: "/agi/$id/vis",
    //     params: {
    //       id: params.id,
    //     },
    //     replace: true,
    //     throw: true,
    //   });
    // }
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
