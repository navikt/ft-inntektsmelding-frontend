import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import React from "react";

import { hentGrunnbeløpOptions } from "~/api/queries.ts";
import { VisHjelpeteksterStateProvider } from "~/features/Hjelpetekst.tsx";
import { InntektsmeldingSkjemaStateProvider } from "~/features/InntektsmeldingSkjemaState";

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((response) => ({
        default: response.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: ({ context }) => {
      // Bruker prefetch for å ikke vente på dette nettverkskallet, men gjøre det klar i cache så fort som mulig
    context.queryClient.prefetchQuery(hentGrunnbeløpOptions());
  },

  component: () => {
    return (
      <>
        <React.Suspense fallback="">
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
        <VisHjelpeteksterStateProvider>
          <InntektsmeldingSkjemaStateProvider>
            <Outlet />
          </InntektsmeldingSkjemaStateProvider>
        </VisHjelpeteksterStateProvider>
        <ScrollRestoration />
      </>
    );
  },
});
