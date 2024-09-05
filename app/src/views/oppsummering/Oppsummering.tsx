import { ArrowLeftIcon, PaperplaneIcon } from "@navikt/aksel-icons";
import { Alert, BodyLong, Button, Heading, Stack } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import {
  getRouteApi,
  Link,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";

import { sendInntektsmelding } from "~/api/mutations.ts";
import type { OpplysningerDto } from "~/api/queries";
import {
  InntektsmeldingSkjemaStateValid,
  useInntektsmeldingSkjema,
} from "~/features/InntektsmeldingSkjemaState";
import { Fremgangsindikator } from "~/features/skjema-moduler/Fremgangsindikator";
import { SendInntektsmeldingRequestDto } from "~/types/api-models.ts";
import { formatIsoDatostempel } from "~/utils";

import { Skjemaoppsummering } from "../shared/Skjemaoppsummering";

const route = getRouteApi("/$id");

export const Oppsummering = () => {
  const { opplysninger } = useLoaderData({ from: "/$id" });
  const { id } = route.useParams();

  const { gyldigInntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  if (!gyldigInntektsmeldingSkjemaState) {
    return (
      <Alert variant="error">
        <Stack gap="4">
          <BodyLong>
            Noe gikk galt med utfyllingen av inntektsmeldingen din. Du må
            dessverre begynne på nytt.
          </BodyLong>
          <Button
            as={Link}
            params={{ id }}
            size="small"
            to="/$id"
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
      <div className="bg-bg-default mt-6 px-5 py-6 rounded-md flex flex-col gap-6">
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
  const { id } = route.useParams();

  const { gyldigInntektsmeldingSkjemaState } = useInntektsmeldingSkjema();

  const { mutate, error, isPending } = useMutation({
    mutationFn: async (skjemaState: InntektsmeldingSkjemaStateValid) => {
      const gjeldendeInntekt =
        skjemaState.inntektEndringsÅrsak?.korrigertInntekt ??
        skjemaState.inntekt;

      const inntektsmelding = {
        foresporselUuid: id,
        aktorId: opplysninger.person.aktørId,
        ytelse: opplysninger.ytelse,
        arbeidsgiverIdent: opplysninger.arbeidsgiver.organisasjonNummer,
        kontaktperson: skjemaState.kontaktperson,
        startdato: opplysninger.startdatoPermisjon,
        inntekt: gjeldendeInntekt,
        refusjon: skjemaState.refusjonsbeløpPerMåned,
        // inntektEndringsÅrsak: skjemaState.inntektEndringsÅrsak, // Send inn når BE har støtte for det
        refusjonsendringer: utledRefusjonsPerioder([
          ...skjemaState.refusjonsendringer,
          {
            beløp: gjeldendeInntekt,
            fom: opplysninger.startdatoPermisjon,
          },
        ]),
        bortfaltNaturalytelsePerioder: konverterNaturalytelsePerioder(
          skjemaState.naturalytelserSomMistes,
        ),
      };

      return sendInntektsmelding(inntektsmelding);
    },
    onSuccess: () => {
      navigate({
        from: "/$id/oppsummering",
        to: "../kvittering",
      });
    },
  });
  if (!gyldigInntektsmeldingSkjemaState) {
    return null;
  }

  return (
    <>
      {/*TODO: hvordan feilmeldinger viser man mot bruker?*/}
      {error ? <Alert variant="error">Noe gikk galt.</Alert> : undefined}
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

function konverterNaturalytelsePerioder(
  naturalytelsePerioder: InntektsmeldingSkjemaStateValid["naturalytelserSomMistes"],
): SendInntektsmeldingRequestDto["bortfaltNaturalytelsePerioder"] {
  return naturalytelsePerioder.map((periode) => ({
    naturalytelsetype: periode.navn,
    fom: formatIsoDatostempel(new Date(periode.fom)), // TODO: kan vi fjerne format
    beløp: periode.beløp,
    tom: periode.tom,
  }));
}

function utledRefusjonsPerioder(
  refusjonsendringer: InntektsmeldingSkjemaStateValid["refusjonsendringer"],
): SendInntektsmeldingRequestDto["refusjonsendringer"] {
  return refusjonsendringer.map((endring) => ({
    fom: endring.fom,
    beløp: endring.beløp,
  }));
}
