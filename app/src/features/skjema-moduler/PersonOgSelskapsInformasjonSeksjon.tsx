import { ArrowRightIcon, FloppydiskIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  CopyButton,
  GuidePanel,
  Heading,
  HGrid,
  Label,
  TextField,
} from "@navikt/ds-react";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import type { OpplysningerDto } from "~/api/queries";
import {
  type InntektsmeldingSkjemaState,
  useInntektsmeldingSkjema,
} from "~/features/InntektsmeldingSkjemaState";
import {
  formatFødselsnummer,
  formatYtelsesnavn,
  slåSammenTilFulltNavn,
} from "~/utils";

import { InformasjonsseksjonMedKilde } from "../InformasjonsseksjonMedKilde";
import { Fremgangsindikator } from "./Fremgangsindikator";

type PersonOgSelskapsInformasjonForm = NonNullable<
  InntektsmeldingSkjemaState["kontaktperson"]
>;

export const PersonOgSelskapsInformasjonSeksjon = () => {
  const opplysninger = useLoaderData({ from: "/$id" });
  const { inntektsmeldingSkjemaState, setInntektsmeldingSkjemaState } =
    useInntektsmeldingSkjema();
  const { register, handleSubmit, formState } =
    useForm<PersonOgSelskapsInformasjonForm>({
      defaultValues: {
        ...inntektsmeldingSkjemaState.kontaktperson,
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
  return (
    <section className="mt-6">
      <form onSubmit={onSubmit}>
        <div className="bg-bg-default px-5 py-6 rounded-md flex flex-col gap-6">
          <Heading level="3" size="large">
            Dine opplysninger
          </Heading>
          <Fremgangsindikator aktivtSteg={1} />

          <Intro opplysninger={opplysninger} />
          <div className="flex flex-col sm:flex-row gap-6">
            <ArbeidsgiverInformasjon opplysninger={opplysninger} />
            <Personinformasjon opplysninger={opplysninger} />
          </div>

          <InformasjonsseksjonMedKilde
            className="col-span-2"
            kilde="Fra Altinn"
            tittel="Innsender og kontaktperson"
          >
            <HGrid align="start" columns={{ sm: 1, md: 2 }} gap="5">
              <TextField
                className="w-full"
                {...register("navn", { required: "Navn er påkrevd" })}
                error={formState.errors.navn?.message}
                label="Navn innsender"
                size="medium"
              />
              <TextField
                className="w-full md:w-1/2"
                {...register("telefonnummer", {
                  required: "Telefonnummer er påkrevd",
                  // TODO: Legg til mer avansert validering for telefonnumre
                })}
                error={formState.errors.telefonnummer?.message}
                label="Telefon innsender"
                size="medium"
              />
            </HGrid>
            <Alert variant="info">
              <Heading level="3" size="small">
                Stemmer informasjonen?
              </Heading>
              <BodyShort>
                Har vi spørsmål til inntektsmeldingen er det viktig at vi når
                rett person. Legg til ekstra kontaktperson dersom du vet du vil
                være utilgjengelig fremover.
              </BodyShort>
            </Alert>
          </InformasjonsseksjonMedKilde>

          <div className="flex justify-center col-span-2">
            <Button
              icon={<ArrowRightIcon />}
              iconPosition="right"
              type="submit"
              variant="primary"
            >
              Bekreft og gå videre
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <Button
            icon={<FloppydiskIcon />}
            iconPosition="left"
            variant="tertiary"
          >
            Fortsett senere
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
  const fulltNavn = slåSammenTilFulltNavn(
    person.fornavn,
    person.mellomnavn,
    person.etternavn,
  );
  const fornavn = person.fornavn;

  return (
    <GuidePanel className="mb-4 col-span-2">
      <div className="flex flex-col gap-4">
        <Heading level="3" size="medium">
          Hei {fornavn}!
        </Heading>
        <BodyLong>
          <strong>
            {fulltNavn} ({formatFødselsnummer(person.fødselsnummer)})
          </strong>{" "}
          som jobber på <strong>{arbeidsgiver.organisasjonNavn}</strong> har
          søkt om {formatYtelsesnavn(opplysninger.ytelse)}. NAV trenger derfor
          informasjon om inntekten til {fornavn}.
        </BodyLong>
        <BodyLong>
          Vi har forhåndsutfylt skjema med opplysninger fra søknaden til{" "}
          {fornavn} og A-ordningen. Bekreft om opplysningene om den ansatte
          stemmer eller endre hvis noe er feil. Den ansatte vil få tilgang til å
          se innsendt inntektsmelding under «Min side» på nav.no.
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
  const fulltNavn = slåSammenTilFulltNavn(
    person.fornavn,
    person.mellomnavn,
    person.etternavn,
  );

  return (
    <InformasjonsseksjonMedKilde kilde="Fra søknad" tittel="Den ansatte">
      <LabelOgVerdi label="Navn">{fulltNavn}</LabelOgVerdi>
      <LabelOgVerdi label="Fødselsdato">
        <div className="flex items-center gap-2">
          {formatFødselsnummer(person.fødselsnummer)}{" "}
          <CopyButton copyText={person.fødselsnummer} size="small" />
        </div>
      </LabelOgVerdi>
    </InformasjonsseksjonMedKilde>
  );
};

type ArbeidsgiverInformasjonProps = {
  opplysninger: OpplysningerDto;
};
const ArbeidsgiverInformasjon = ({
  opplysninger,
}: ArbeidsgiverInformasjonProps) => {
  const { arbeidsgiver } = opplysninger;

  return (
    <InformasjonsseksjonMedKilde kilde="Fra Altinn" tittel="Arbeidsgiver">
      <LabelOgVerdi label="Virksomhetsnavn">
        {arbeidsgiver.organisasjonNavn}
      </LabelOgVerdi>
      <LabelOgVerdi label="Org. nr. for underenhet">
        {arbeidsgiver.organisasjonNummer}
      </LabelOgVerdi>
    </InformasjonsseksjonMedKilde>
  );
};

type LabelOgVerdiProps = {
  label: string;
  children: React.ReactNode;
};
const LabelOgVerdi = ({ label, children }: LabelOgVerdiProps) => {
  return (
    <div>
      <Label as="p" size="small">
        {label}
      </Label>
      <BodyShort as="div">{children}</BodyShort>
    </div>
  );
};
