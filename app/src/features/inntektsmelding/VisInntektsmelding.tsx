import { DownloadIcon, PencilIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyShort,
  Button,
  Detail,
  Heading,
  HStack,
  VStack,
} from "@navikt/ds-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { hentInntektsmeldingPdfUrl } from "~/api/queries";
import { useInntektsmeldingSkjema } from "~/features/InntektsmeldingSkjemaState.tsx";
import { finnSenesteInntektsmelding, formatDatoTidKort } from "~/utils.ts";

import { Skjemaoppsummering } from "./Skjemaoppsummering";

const route = getRouteApi("/$id");

export const VisInntektsmelding = () => {
  const { opplysninger, eksisterendeInntektsmeldinger } = route.useLoaderData();
  const { id } = route.useParams();
  const { setInntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  const sisteInntektsmelding = finnSenesteInntektsmelding(
    eksisterendeInntektsmeldinger,
  );

  // Sett IM i skjemaStaten hvis den finnes
  useEffect(() => {
    if (sisteInntektsmelding) {
      setInntektsmeldingSkjemaState(sisteInntektsmelding);
    }
  }, [sisteInntektsmelding]);

  if (!sisteInntektsmelding) {
    return null;
  }

  const endreKnapp = (
    <Button
      as={Link}
      className="w-fit"
      disabled={opplysninger.forespørselStatus === "UTGÅTT"}
      icon={<PencilIcon />}
      to="../dine-opplysninger"
      variant="secondary"
    >
      Endre
    </Button>
  );

  return (
    <section className="mt-4">
      <VStack className="bg-bg-default px-5 py-6 rounded-md" gap="6">
        <HStack gap="2" justify="space-between">
          <VStack>
            <Heading level="1" size="medium">
              Innsendt inntektsmelding
            </Heading>
            <Detail uppercase>
              sendt inn{" "}
              {formatDatoTidKort(
                new Date(sisteInntektsmelding.opprettetTidspunkt),
              )}
            </Detail>
          </VStack>
          {endreKnapp}
        </HStack>
        {opplysninger.forespørselStatus === "UTGÅTT" && (
          <Alert className="my-4" variant="warning">
            <BodyShort>
              Du kan ikke endre inntektsmeldingen når oppgaven den er knyttet
              til er utgått. Det kan skje når søkeren trekker søknaden sin etter
              man har sendt inn en inntektsmelding for den søknaden.
            </BodyShort>
          </Alert>
        )}
        <Skjemaoppsummering
          opplysninger={opplysninger}
          skjemaState={sisteInntektsmelding}
        />
        <HStack gap="4" justify="space-between">
          <HStack gap="4">
            {endreKnapp}

            <Button as="a" href="/min-side-arbeidsgiver" variant="tertiary">
              Lukk
            </Button>
          </HStack>
          <Button
            as="a"
            download={`inntektsmelding-${id}.pdf`}
            href={hentInntektsmeldingPdfUrl(sisteInntektsmelding.id)}
            icon={<DownloadIcon />}
            variant="tertiary"
          >
            Last ned inntektsmeldingen
          </Button>
        </HStack>
      </VStack>
    </section>
  );
};
