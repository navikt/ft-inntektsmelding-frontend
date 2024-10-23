import {
  BodyShort,
  Box,
  Button,
  Heading,
  HGrid,
  Page,
  VStack,
} from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";

export const OppgaveErUtgåttFeilside = () => {
  return (
    <Page>
      <PageBlock as="main" gutters width="xl">
        <Box paddingBlock="20 8">
          <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
            <VStack gap="16">
              <VStack align="start" gap="12">
                <div>
                  <Heading level="1" size="large" spacing>
                    Oppgaven er utgått
                  </Heading>
                  <BodyShort spacing>Her er noe info</BodyShort>
                </div>

                <Button as="a" href="/min-side-arbeidsgiver">
                  Gå til Min side - arbeidsgiver
                </Button>
              </VStack>
            </VStack>
          </HGrid>
        </Box>
      </PageBlock>
    </Page>
  );
};
