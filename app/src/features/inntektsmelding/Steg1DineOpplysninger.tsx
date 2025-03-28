import { ArrowRightIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  CopyButton,
  GuidePanel,
  Heading,
  HGrid,
  TextField,
} from "@navikt/ds-react";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { useHjelpetekst } from "~/features/Hjelpetekst.tsx";
import { useOpplysninger } from "~/features/inntektsmelding/useOpplysninger";
import {
  type InntektsmeldingSkjemaState,
  useInntektsmeldingSkjema,
} from "~/features/InntektsmeldingSkjemaState";
import type { OpplysningerDto } from "~/types/api-models.ts";
import {
  capitalizeSetning,
  formatFødselsnummer,
  formatYtelsesnavn,
  lagFulltNavn,
} from "~/utils";

import { Informasjonsseksjon } from "../Informasjonsseksjon";
import { Fremgangsindikator } from "../skjema-moduler/Fremgangsindikator";
import { useDocumentTitle } from "../useDocumentTitle";

type PersonOgSelskapsInformasjonForm = NonNullable<
  InntektsmeldingSkjemaState["kontaktperson"]
>;

export const Steg1DineOpplysninger = () => {
  const opplysninger = useOpplysninger();
  useDocumentTitle(
    `Dine opplysninger – inntektsmelding for ${formatYtelsesnavn(opplysninger.ytelse)}`,
  );
  const { eksisterendeInntektsmeldinger } = useLoaderData({ from: "/$id" });
  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();

  const innsenderNavn = lagFulltNavn(opplysninger.innsender);

  const { register, handleSubmit, formState } =
    useForm<PersonOgSelskapsInformasjonForm>({
      defaultValues: {
        ...(inntektsmeldingSkjemaState.kontaktperson ?? {
          navn: innsenderNavn,
          telefonnummer: opplysninger.innsender.telefon,
        }),
      },
    });
  const navigate = useNavigate();

  const onSubmit = handleSubmit((kontaktperson) => {
    setInntektsmeldingSkjemaState((prev) => ({ ...prev, kontaktperson }));
    navigate({
      from: "/$id/dine-opplysninger",
      to: "../inntekt-og-refusjon",
    });
  });

  // Hvis en oppgave er FERDIG, men vi ikke finner noen tidligere IMer kan vi anta den er sendt fra Altinn eller LPS
  const erTidligereSendInnFraAltinn =
    opplysninger.forespørselStatus === "FERDIG" &&
    eksisterendeInntektsmeldinger.length === 0;

  return (
    <section className="mt-2">
      {erTidligereSendInnFraAltinn && (
        <Alert className="mb-4" variant="warning">
          <Heading level="3" size="xsmall" spacing>
            Inntektsmelding er sendt inn via Altinn eller lønns- og
            personalsystem
          </Heading>
          <BodyLong>
            Dere har tidligere sendt inn inntektsmelding for denne perioden via
            Altinn eller bedriftens lønns- og personalsystem. Vi klarer derfor
            ikke vise inntektsmeldingen. For å korrigere eller melde fra om
            endringer kan du fylle ut nytt skjema her.
          </BodyLong>
        </Alert>
      )}
      <form onSubmit={onSubmit}>
        <div className="bg-bg-default px-5 py-6 rounded-md flex flex-col gap-6">
          <Heading level="3" size="large">
            Dine opplysninger
          </Heading>
          <Fremgangsindikator aktivtSteg={1} />

          <Intro opplysninger={opplysninger} />
          <Personinformasjon opplysninger={opplysninger} />
          <Informasjonsseksjon
            className="col-span-2"
            kilde="Fra Altinn og Folkeregisteret"
            tittel="Kontaktinformasjon for arbeidsgiver"
          >
            <HGrid align="start" columns={{ sm: 1, md: 2 }} gap="5">
              <TextField
                className="w-full"
                {...register("navn", {
                  required: "Navn er påkrevd",
                  maxLength: {
                    value: 100,
                    message: "Navn kan ikke være lenger enn 100 tegn",
                  },
                })}
                autoComplete="name"
                error={formState.errors.navn?.message}
                label="Navn"
                size="medium"
              />
              <TextField
                className="w-full"
                {...register("telefonnummer", {
                  required: "Telefonnummer er påkrevd",
                  // Sjekke 8 siffer, eller landskode og vilkårlig antall siffer
                  validate: (data) =>
                    /^(\d{8}|\+\d+)$/.test(data) ||
                    "Telefonnummer må være 8 siffer eller ha landskode",
                })}
                autoComplete="tel"
                error={formState.errors.telefonnummer?.message}
                label="Telefon"
                size="medium"
              />
            </HGrid>
            <Alert variant="info">
              <Heading level="3" size="xsmall" spacing>
                Er kontaktinformasjonen riktig?
              </Heading>
              <BodyLong>
                Hvis vi har spørsmål om inntektsmeldingen, er det viktig at vi
                får kontakt med deg. Bruk derfor direktenummeret ditt i stedet
                for nummeret til sentralbordet. Hvis du vet at du vil være
                utilgjengelig fremover, kan du endre til en annen kontaktperson.
              </BodyLong>
            </Alert>
          </Informasjonsseksjon>

          <Button
            className="w-fit self-center"
            icon={<ArrowRightIcon />}
            iconPosition="right"
            type="submit"
            variant="primary"
          >
            Bekreft og gå videre
          </Button>
        </div>
      </form>
    </section>
  );
};

type IntroProps = {
  opplysninger: OpplysningerDto;
};
const Intro = ({ opplysninger }: IntroProps) => {
  const { person, arbeidsgiver } = opplysninger;
  const fulltNavnSøker = lagFulltNavn(person);
  const fornavnSøker = person.fornavn;

  const { vis } = useHjelpetekst().visHjelpetekster;

  if (!vis) {
    return null;
  }

  return (
    <GuidePanel className="mb-4 col-span-2">
      <div className="flex flex-col gap-4">
        <Heading level="3" size="medium">
          Hei {capitalizeSetning(opplysninger.innsender.fornavn)}!
        </Heading>
        <BodyLong>
          <strong>
            {fulltNavnSøker} ({formatFødselsnummer(person.fødselsnummer)})
          </strong>{" "}
          har søkt om {formatYtelsesnavn(opplysninger.ytelse)}. For å behandle
          søknaden, trenger vi informasjon om {fornavnSøker} sin inntekt fra{" "}
          <strong>{arbeidsgiver.organisasjonNavn}</strong>.
        </BodyLong>
        <BodyLong>
          Vi har forhåndsutfylt skjema med opplysninger fra {fornavnSøker} sin
          søknad og fra A-ordningen. Du må vurdere om informasjonen om den
          ansatte er riktig, og gjøre endringer hvis noe er galt.
        </BodyLong>
        <BodyLong>
          Den ansatte har rett til å se sin egen sak, og kan be om å se
          informasjonen du sender til Nav.
        </BodyLong>
      </div>
    </GuidePanel>
  );
};

type PersoninformasjonProps = {
  opplysninger: OpplysningerDto;
};

const Personinformasjon = ({ opplysninger }: PersoninformasjonProps) => {
  const { person } = opplysninger;
  const fulltNavn = lagFulltNavn(person);

  return (
    <Informasjonsseksjon
      kilde={`Fra søknaden til ${person.fornavn}`}
      tittel="Den ansatte"
    >
      <div>
        <span>{fulltNavn}</span>
        <div className="flex items-center gap-2">
          {formatFødselsnummer(person.fødselsnummer)}{" "}
          <CopyButton copyText={person.fødselsnummer} size="small" />
        </div>
      </div>
    </Informasjonsseksjon>
  );
};
