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
  Button,
  ExpansionCard,
  Heading,
  HStack,
  useId,
} from "@navikt/ds-react";
import {
  ExpansionCardContent,
  ExpansionCardHeader,
  ExpansionCardTitle,
} from "@navikt/ds-react/ExpansionCard";
import { id } from "date-fns/locale";
import { ReactNode } from "react";

import { RotLayout } from "~/features/rot-layout/RotLayout";

export const Steg6Kvittering = () => {
  return (
    <RotLayout tittel="Søknad om refusjon for omsorgspenger">
      <div className="mx-4">
        <div className="mt-12 p-6 bg-surface-success-subtle rounded-full mx-auto w-fit">
          <CheckmarkIcon aria-hidden fontSize="2.5em" />
        </div>
        <Heading className="mt-6 mb-12 text-center" level="2" size="small">
          Søknad om refusjon er sendt.
        </Heading>
        <Alert className="mb-12" variant="success">
          <Heading className="mb-2" level="3" size="medium">
            Vi har mottatt søknaden
          </Heading>
          <BodyLong>
            Vi har mottatt søknad om refusjon av omsorgspenger. Saken ligger nå
            til behandling hos oss. Vi tar kontakt hvis vi trenger flere
            opplysninger fra deg. Vi har mottatt inntektsmeldingen
          </BodyLong>
        </Alert>

        <Heading level="2" size="small">
          Ofte stilte spørsmål
        </Heading>
        <FaqItem
          icon={<ClockIcon />}
          question="Hvor lang er saksbehandlingstiden?"
        >
          TODO
        </FaqItem>
        <FaqItem
          icon={<SackKronerIcon />}
          question="Når blir refusjon utbetalt?"
        >
          TODO
        </FaqItem>
        <FaqItem
          icon={<DocPencilIcon />}
          question="Hvordan korrigere hvis noe er feil?"
        >
          TODO
        </FaqItem>

        <HStack gap="2" justify="center" wrap={true}>
          <Button as="a" href="/min-side-arbeidsgiver" variant="primary">
            Gå til min side – arbeidsgiver
          </Button>
          <Button
            as="a"
            download={`søknad-refusjon-omsorgspenger-${id}.pdf`}
            href="#"
            icon={<DownloadIcon />}
            iconPosition="left"
            variant="secondary"
          >
            Last ned
          </Button>
        </HStack>
      </div>
    </RotLayout>
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
    <ExpansionCard aria-labelledby={`faq-${id}`} className="mb-12">
      <ExpansionCardHeader>
        <ExpansionCardTitle id={`faq-${id}`}>
          <HStack align="center" gap="4">
            {icon}
          </HStack>
          {question}
        </ExpansionCardTitle>
      </ExpansionCardHeader>
      <ExpansionCardContent>{children}</ExpansionCardContent>
    </ExpansionCard>
  );
};
