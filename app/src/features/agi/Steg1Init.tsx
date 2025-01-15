import { Heading, HStack, TextField } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { hentPersonFraFnr } from "~/api/queries.ts";
import { AgiFremgangsindikator } from "~/features/agi/AgiFremgangsindikator.tsx";
import { useDocumentTitle } from "~/features/useDocumentTitle.tsx";
import { formatYtelsesnavn } from "~/utils.ts";

const route = getRouteApi("/agi");

export const Steg1Init = () => {
  const { ytelseType } = route.useSearch();
  useDocumentTitle(
    `Opprett inntektsmelding for ${formatYtelsesnavn(ytelseType)}`,
  );

  const navigate = useNavigate();

  const formMethods = useForm({
    defaultValues: {
      fnr: "",
    },
  });

  const { mutate, data } = useMutation({
    mutationFn: async ({ fnr }: { fnr: string }) => {
      return hentPersonFraFnr(fnr, ytelseType);
    },
  });

  return (
    <section className="mt-2">
      <form onSubmit={formMethods.handleSubmit((values) => mutate(values))}>
        <div className="bg-bg-default px-5 py-6 rounded-md flex flex-col gap-6">
          <Heading level="3" size="large">
            Dine opplysninger
          </Heading>
          <AgiFremgangsindikator aktivtSteg={1} />
          <HStack gap="2">
            <TextField
              {...formMethods.register("fnr")}
              label="Ansattes fødselsnummer (11 siffer)"
            />
            {data ? (
              <span>
                {data.fornavn} {data.etternavn}
              </span>
            ) : null}
          </HStack>
        </div>
      </form>
    </section>
  );
};
