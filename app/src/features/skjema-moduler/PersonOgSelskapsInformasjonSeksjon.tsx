import { ArrowRightIcon, FloppydiskIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  CopyButton,
  Detail,
  GuidePanel,
  Heading,
  HGrid,
  Label,
  TextField,
} from "@navikt/ds-react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

import type { InntektsmeldingDialogDto } from "~/types/api-models.ts";

import { Fremgangsindikator } from "./Fremgangsindikator";

type PersonOgSelskapsInformasjonSeksjonProps = {
  className?: string;
  inntektsmeldingDialogDto: InntektsmeldingDialogDto;
};

export const PersonOgSelskapsInformasjonSeksjon = ({
  inntektsmeldingDialogDto,
  className,
}: PersonOgSelskapsInformasjonSeksjonProps) => {
  return (
    <section className={className}>
      <form>
        <HGrid
          className="bg-bg-default px-5 py-6 rounded-md"
          columns={{ xs: 1, md: 2 }}
          gap="6"
        >
          <Heading level="3" size="large">
            Dine opplysninger
          </Heading>
          <Fremgangsindikator aktivtSteg={1} />
          <Intro inntektsmeldingDialogDto={inntektsmeldingDialogDto} />
          <ArbeidsgiverInformasjon
            inntektsmeldingDialogDto={inntektsmeldingDialogDto}
          />
          <Personinformasjon
            inntektsmeldingDialogDto={inntektsmeldingDialogDto}
          />
          <InnsenderOgKontaktpersonInformasjon />

          <div className="flex justify-center col-span-2">
            <Button
              as={Link}
              icon={<ArrowRightIcon />}
              iconPosition="right"
              to="../inntekt-og-refusjon"
              variant="primary"
            >
              Bekreft og gå videre
            </Button>
          </div>
        </HGrid>
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
  inntektsmeldingDialogDto: InntektsmeldingDialogDto;
};
const Intro = ({ inntektsmeldingDialogDto }: IntroProps) => {
  const { person, arbeidsgiver } = inntektsmeldingDialogDto;
  const [fornavn] = person.navn.split(" ") ?? ["den ansatte"];
  return (
    <GuidePanel className="mb-4 col-span-2">
      <div className="flex flex-col gap-4">
        <Heading level="3" size="medium">
          Hei der!
        </Heading>
        <BodyLong>
          <strong>
            {person.navn} ({formaterFødselsnummer(person.fødselsnummer)})
          </strong>{" "}
          som jobber på <strong>{arbeidsgiver.organisasjonNavn}</strong> har
          søkt om foreldrepenger. NAV trenger derfor informasjon om inntekten
          til {fornavn}.
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
  inntektsmeldingDialogDto: InntektsmeldingDialogDto;
};

const Personinformasjon = ({
  inntektsmeldingDialogDto,
}: PersoninformasjonProps) => {
  const { person } = inntektsmeldingDialogDto;

  return (
    <InformasjonsseksjonMedKilde kilde="Fra søknad" tittel="Den ansatte">
      <LabelOgVerdi label="Navn">{person.navn}</LabelOgVerdi>
      <LabelOgVerdi label="Fødselsdato">
        <div className="flex items-center gap-2">
          {formaterFødselsnummer(person.fødselsnummer)}{" "}
          <CopyButton copyText={person.fødselsnummer} size="small" />
        </div>
      </LabelOgVerdi>
    </InformasjonsseksjonMedKilde>
  );
};

const formaterFødselsnummer = (str: string) => {
  if (str?.length !== 11) {
    return str;
  }
  return str.slice(0, 6) + " " + str.slice(6);
};

type ArbeidsgiverInformasjonProps = {
  inntektsmeldingDialogDto: InntektsmeldingDialogDto;
};
const ArbeidsgiverInformasjon = ({
  inntektsmeldingDialogDto,
}: ArbeidsgiverInformasjonProps) => {
  const { arbeidsgiver } = inntektsmeldingDialogDto;

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

const InnsenderOgKontaktpersonInformasjon = () => {
  return (
    <InformasjonsseksjonMedKilde
      className="col-span-2"
      kilde="Fra Altinn"
      tittel="Innsender og kontaktperson"
    >
      <HGrid columns={{ sm: 1, md: 2 }} gap="5">
        <TextField
          className="w-full"
          defaultValue="Innlogget Bruker"
          label="Navn innsender"
          name="navn-innsender"
          size="medium"
        />
        <TextField
          className="w-full md:w-1/2"
          label="Telefon innsender"
          name="telefon-innsender"
          size="medium"
        />
      </HGrid>
      <Alert variant="info">
        <Heading level="3" size="small">
          Stemmer informasjonen?
        </Heading>
        <BodyShort>
          Har vi spørsmål til inntektsmeldingen er det viktig at vi når rett
          person. Legg til ekstra kontaktperson dersom du vet du vil være
          utilgjengelig fremover.
        </BodyShort>
      </Alert>
    </InformasjonsseksjonMedKilde>
  );
};

type InformasjonsseksjonMedKildeProps = {
  kilde: string;
  tittel: string;
  children: React.ReactNode;
  className?: string;
};
export const InformasjonsseksjonMedKilde = ({
  children,
  kilde,
  tittel,
  className,
}: InformasjonsseksjonMedKildeProps) => {
  return (
    <div
      className={clsx(
        "bg-bg-subtle p-4 flex flex-col gap-4 rounded-md",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <Heading level="3" size="xsmall">
          {tittel}
        </Heading>
        <Detail className="uppercase flex items-center">{kilde}</Detail>
      </div>
      {children}
    </div>
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
      <BodyShort>{children}</BodyShort>
    </div>
  );
};
