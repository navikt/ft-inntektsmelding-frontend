import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import React from "react";

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
        <InntektsmeldingSkjemaStateProvider>
          <Outlet />
        </InntektsmeldingSkjemaStateProvider>
        <ScrollRestoration />
      </>
    );
  },
});
