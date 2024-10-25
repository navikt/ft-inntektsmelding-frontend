import { Button } from "@navikt/ds-react";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import React from "react";

import { hentGrunnbeløpOptions } from "~/api/queries.ts";
import { GenerellFeilside } from "~/features/error-boundary/GenerellFeilside";
import { VisHjelpeteksterStateProvider } from "~/features/Hjelpetekst.tsx";

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
  errorComponent: GenerellFeilside,

  component: () => {
    return (
      <>
        <React.Suspense fallback="">
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
        <VisHjelpeteksterStateProvider>
          <Button
            onClick={() => {
              throw new Error("første feil");
            }}
          >
            Kræsj
          </Button>
          <Outlet />
        </VisHjelpeteksterStateProvider>
        <ScrollRestoration />
      </>
    );
  },
});
