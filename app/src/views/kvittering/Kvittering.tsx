import {
  CheckmarkIcon,
  DownloadIcon,
  InformationIcon,
} from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  Button,
  ExpansionCard,
  Heading,
  HStack,
} from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";

const route = getRouteApi("/$id/kvittering");

export const Kvittering = () => {
  const { id } = route.useParams();
  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/arbeidsgiver/min-side",
      },
      {
        title: "Kvittering, inntektsmelding",
        url: `/${id}/kvittering`,
      },
    ]);
  }, [id]);
  return (
    <div className="mx-4">
      <div className="mt-12 p-6 bg-surface-success-subtle rounded-full mx-auto w-fit">
        <CheckmarkIcon aria-hidden fontSize="2.5em" />
      </div>
      <Heading className="mt-6 mb-12 text-center" level="2" size="small">
        Inntektsmelding for FULLT NAVN er sendt
      </Heading>
      <Alert className="mb-12" variant="success">
        <Heading className="mb-2" level="3" size="medium">
          Vi har mottatt inntektsmeldingen
        </Heading>
        <BodyLong>
          TODO: Saksbehandler vil nå se på inntektsmeldingen for å
          viderebehandle søknaden om YTELSE. Vi tar kontakt om vi trenger mer
          informasjon fra dere.
        </BodyLong>
      </Alert>
      <BodyLong className="mb-12">
        TODO: Du kan laste ned kvitteringen som en PDF-fil. Denne kan du lagre
        og dele med den ansatte.
      </BodyLong>
      <ExpansionCard aria-labelledby="prosessen-videre" className="mb-12">
        <ExpansionCard.Header>
          <ExpansionCard.Title id="prosessen-videre">
            <HStack align="center" gap="4">
              <div
                aria-hidden
                className="p-2 bg-surface-info-subtle rounded-full w-fit"
              >
                <InformationIcon />
              </div>
              Prosessen videre for deg og den ansatte
            </HStack>
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <BodyLong>
            TODO: Saksbehandler vil nå se på inntektsmeldingen for å
            viderebehandle søknaden om YTELSE. Vi tar kontakt om vi trenger mer
            informasjon fra dere.
          </BodyLong>
        </ExpansionCard.Content>
      </ExpansionCard>
      <HStack gap="2" justify="center" wrap={true}>
        <Button variant="primary">Gå til min side – arbeidsgiver</Button>
        <Button
          icon={<DownloadIcon />}
          iconPosition="left"
          onClick={() => alert("Denne funksjonen er ikke laget enda.")}
          variant="secondary"
        >
          Last ned som PDF
        </Button>
      </HStack>
    </div>
  );
};
