import {
  CheckmarkIcon,
  ClockIcon,
  DocPencilIcon,
  DownloadIcon,
  SackKronerIcon,
} from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  ExpansionCard,
  Heading,
  HStack,
  Link,
  useId,
  VStack,
} from "@navikt/ds-react";
import {
  ExpansionCardContent,
  ExpansionCardHeader,
  ExpansionCardTitle,
} from "@navikt/ds-react/ExpansionCard";
import { id } from "date-fns/locale";
import { ReactNode } from "react";

import { hentInntektsmeldingPdfUrl } from "~/api/queries";

import { useDocumentTitle } from "../useDocumentTitle";
import { useRefusjonOmsorgspengerArbeidsgiverFormContext } from "./RefusjonOmsorgspengerArbeidsgiverForm";
export const Steg6Kvittering = () => {
  useDocumentTitle(
    "Kvittering – søknad om refusjon av omsorgspenger for arbeidsgiver",
  );

  const { getValues } = useRefusjonOmsorgspengerArbeidsgiverFormContext();
  return (
    <div>
      <div className="mx-4">
        <div className="mt-12 p-6 bg-surface-success-subtle rounded-full mx-auto w-fit">
          <CheckmarkIcon aria-hidden fontSize="2.5em" />
        </div>
        <Heading className="mt-6 mb-12 text-center" level="2" size="small">
          Refusjonskrav om omsorgspenger er sendt
        </Heading>
        <Alert className="mb-12" variant="success">
          <Heading className="mb-2" level="3" size="medium">
            Vi har mottatt refusjonskravet
          </Heading>
          <BodyLong>
            Vi har mottatt refusjonskrav for omsorgspenger. Saken ligger når til
            behandling hos oss. Vi tar kontakt hvis vi trenger flere
            opplysninger fra deg.
          </BodyLong>
        </Alert>

        <Heading className="mb-4" level="2" size="small">
          Ofte stilte spørsmål
        </Heading>
        <VStack className="mb-12" gap="2">
          <FaqItem
            icon={<ClockIcon />}
            question="Hvor lang er saksbehandlingstiden?"
          >
            <Link href="https://www.nav.no/arbeidsgiver/saksbehandlingstider#omsorgspenger-hjemme-med-sykt-barn-dager">
              Her
            </Link>{" "}
            finner du oversikt over saksbehandlingstiden til Nav. Vi tar kontakt
            hvis vi trenger flere opplysninger.
          </FaqItem>
          <FaqItem
            icon={<SackKronerIcon />}
            question="Når blir refusjon utbetalt?"
          >
            Refusjon utbetales ved hvert månedsskifte, etter at refusjonskravet
            er behandlet. Vi utbetaler til det kontonummeret som arbeidsgiver
            har registrert i Altinn. Du får ikke beskjed når søknaden er
            behandlet, og må derfor følge med på oppgjørsrapport K27 om status
            på søknad og utbetaling av refusjon.
          </FaqItem>
          <FaqItem
            icon={<DocPencilIcon />}
            question="Hvordan korrigere hvis noe er feil?"
          >
            <BodyShort>
              Du finner refusjonskravet ved å logge inn på Min Side
              Arbeidsgiver. Der kan du se refusjonskravet, og eventuelt endre
              informasjonen. Når vi får inn et nytt eller endret refusjonskrav,
              revurderer vi saken. Hvis arbeidsgiveren har fått for mye
              utbetalt, trekkes dette i neste utbetaling.
            </BodyShort>
            <Link
              className="mt-4"
              href="https://www.nav.no/arbeidsgiver/omsorgspenger#inntektsmelding"
            >
              Her
            </Link>{" "}
            finner du informasjon om hvordan du kan endre et
            refusjonskrav/inntektsmelding.
          </FaqItem>
        </VStack>

        <HStack gap="2" justify="center" wrap={true}>
          <Button as="a" href="/min-side-arbeidsgiver" variant="primary">
            Gå til min side – arbeidsgiver
          </Button>
          <Button
            as="a"
            download={`refusjon-omsorgspenger-søknad-kvittering-${id}.pdf`}
            href={hentInntektsmeldingPdfUrl(
              getValues("meta.innsendtSøknadId") as number,
            )}
            icon={<DownloadIcon />}
            iconPosition="left"
            variant="secondary"
          >
            Last ned refusjonskrav
          </Button>
        </HStack>
      </div>
    </div>
  );
};

type FaqItemProps = {
  question: string;
  children: ReactNode;
  icon: ReactNode;
};

const FaqItem = ({ question, children, icon }: FaqItemProps) => {
  const id = useId();
  return (
    <ExpansionCard aria-labelledby={`faq-${id}`} size="small">
      <ExpansionCardHeader>
        <ExpansionCardTitle id={`faq-${id}`}>
          <HStack align="center" gap="4">
            {icon}
            {question}
          </HStack>
        </ExpansionCardTitle>
      </ExpansionCardHeader>
      <ExpansionCardContent>{children}</ExpansionCardContent>
    </ExpansionCard>
  );
};
