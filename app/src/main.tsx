import "@navikt/ds-css";
import "./index.css";

import {
  BodyShort,
  Box,
  Button,
  Heading,
  Page,
  VStack,
} from "@navikt/ds-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import { createRoot } from "react-dom/client";

import { routeTree } from "./routeTree.gen.ts";

export const queryClient = new QueryClient();

const router = createRouter({
  defaultNotFoundComponent: NotFoundComponent,
  routeTree,
  basepath: import.meta.env.BASE_URL,
  context: {
    queryClient,
  },
  defaultPreload: "intent",

  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);

function NotFoundComponent() {
  return (
    <Page>
      <Page.Block as="main" gutters width="xl">
        <Box data-aksel-template="404-v2" paddingBlock="20 16">
          <VStack align="start" gap="12">
            <div>
              <Heading level="1" size="large" spacing>
                Beklager, vi fant ikke siden
              </Heading>
              <BodyShort>
                Denne siden kan være slettet eller flyttet, eller det er en feil
                i lenken.
              </BodyShort>
            </div>
            <Button
              as="a"
              href="https://arbeidsgiver.nav.no/min-side-arbeidsgiver"
            >
              Gå til Min side arbeidsgiver
            </Button>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
}
