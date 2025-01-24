import { createFileRoute } from "@tanstack/react-router";

import { Steg1Init } from "~/features/agi/Steg1Init.tsx";

export const Route = createFileRoute("/agi/")({
  component: () => {
    return (
      <>
        <Steg1Init />
      </>
    );
  },
});
