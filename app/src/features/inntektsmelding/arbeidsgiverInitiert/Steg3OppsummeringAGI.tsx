import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Alert, BodyLong, Button, Heading, Stack } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";

import { sendInntektsmeldingArbeidsgiverInitiert } from "~/api/mutations.ts";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator";
import { useDocumentTitle } from "~/features/useDocumentTitle";
import type {
  OpplysningerDto,
  SendInntektsmeldingRequestDtoSchemaArbeidsgiverInitiert,
} from "~/types/api-models.ts";
import { formatStrengTilTall, formatYtelsesnavn } from "~/utils";

import { useScrollToTopOnMount } from "../../useScrollToTopOnMount";
import { Skjemaoppsummering } from "../Skjemaoppsummering";
import { useOpplysninger } from "../useOpplysninger";
import {
  InntektsmeldingSkjemaStateValidAGI,
  useInntektsmeldingSkjemaAGI,
} from "./SkjemaStateAGI";

const route = getRouteApi("/$id");

export const Steg3Oppsummering = () => {
  useScrollToTopOnMount();
  const opplysninger = useOpplysninger();
  useDocumentTitle(
    `Oppsummering – inntektsmelding for ${formatYtelsesnavn(opplysninger.ytelse)}`,
  );
  const { id } = route.useParams();

  const { gyldigInntektsmeldingSkjemaState, inntektsmeldingSkjemaStateError } =
    useInntektsmeldingSkjemaAGI();

  if (!gyldigInntektsmeldingSkjemaState) {
    // På dette punktet "skal" skjemaet være gyldig med mindre noe har gått galt. Logg error til Grafana for innsikt.
    // eslint-disable-next-line no-console
    console.error(
      "Ugyldig skjemaState på oppsummeringssiden",
      inntektsmeldingSkjemaStateError,
    );
    return (
      <Alert className="mt-4 mx-4 md:mx-0" variant="error">
        <Stack gap="4">
          <BodyLong>
            Noe gikk galt med utfyllingen av inntektsmeldingen din. Du må
            dessverre begynne på nytt.
          </BodyLong>
          <Button
            as={Link}
            size="small"
            to={`/${id}`}
            variant="secondary-neutral"
          >
            Start på nytt
          </Button>
        </Stack>
      </Alert>
    );
  }

  return (
    <section>
      <div className="bg-bg-default mt-4 px-5 py-6 rounded-md flex flex-col gap-6">
        <Heading level="2" size="large">
          Oppsummering
        </Heading>
        <Fremgangsindikator aktivtSteg={3} />
        <Skjemaoppsummering
          opplysninger={opplysninger}
          skjemaState={gyldigInntektsmeldingSkjemaState}
        />
        <SendInnInntektsmelding opplysninger={opplysninger} />
      </div>
    </section>
  );
};

type SendInnInntektsmeldingProps = {
  opplysninger: OpplysningerDto;
};
function SendInnInntektsmelding({ opplysninger }: SendInnInntektsmeldingProps) {
  const navigate = useNavigate();

  const { gyldigInntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjemaAGI();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async (skjemaState: InntektsmeldingSkjemaStateValidAGI) => {
      const inntektsmeldingRequest = lagSendInntektsmeldingRequest(
        skjemaState,
        opplysninger,
      );

      return sendInntektsmeldingArbeidsgiverInitiert(inntektsmeldingRequest);
    },
    onSuccess: (inntektsmeldingState) => {
      setInntektsmeldingSkjemaState(inntektsmeldingState);
      navigate({
        from: "/agi/oppsummering",
        to: "../kvittering",
      });
    },
  });

  if (!gyldigInntektsmeldingSkjemaState) {
    return null;
  }

  return (
    <>
      {error ? <Alert variant="error">{error.message}</Alert> : undefined}
      <div className="flex gap-4 justify-center">
        <Button
          as={Link}
          icon={<ArrowLeftIcon />}
          to="../inntekt-og-refusjon"
          variant="secondary"
        >
          Forrige steg
        </Button>
        <Button
          icon={<PaperplaneIcon />}
          iconPosition="right"
          loading={isPending}
          onClick={() => mutate(gyldigInntektsmeldingSkjemaState)}
          variant="primary"
        >
          Send inn
        </Button>
      </div>
    </>
  );
}

function lagSendInntektsmeldingRequest(
  skjemaState: InntektsmeldingSkjemaStateValid,
  opplysninger: OpplysningerDto,
) {
  const refusjon =
    skjemaState.skalRefunderes === "JA_LIK_REFUSJON"
      ? skjemaState.refusjon.slice(0, 1)
      : skjemaState.skalRefunderes === "JA_VARIERENDE_REFUSJON"
        ? skjemaState.refusjon
        : [];

  return {
    aktorId: opplysninger.person.aktørId,
    ytelse: opplysninger.ytelse,
    arbeidsgiverIdent: opplysninger.arbeidsgiver.organisasjonNummer,
    kontaktperson: skjemaState.kontaktperson,
    startdato: opplysninger.førsteUttaksdato,
    refusjon: refusjon.map((r) => ({
      ...r,
      beløp: formatStrengTilTall(r.beløp),
    })),
  } satisfies SendInntektsmeldingRequestDtoSchemaArbeidsgiverInitiert;
}
