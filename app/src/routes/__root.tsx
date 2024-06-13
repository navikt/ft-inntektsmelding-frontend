import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import React from "react";

import { VisHjelpeTeksterStateProvider } from "~/features/HjelpeTekst.tsx";
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
  component: () => {
    return (
      <>
        <React.Suspense fallback="">
          <TanStackRouterDevtools position="bottom-right" />
        </React.Suspense>
        <VisHjelpeTeksterStateProvider>
          <InntektsmeldingSkjemaStateProvider>
            <Outlet />
          </InntektsmeldingSkjemaStateProvider>
        </VisHjelpeTeksterStateProvider>
        <ScrollRestoration />
      </>
    );
  },
});
