# Ende-til-ende tester

Denne mappen inneholder tester som kjører i Playwright.

## Playwright?

Playwright er et verktøy for å lage og kjøre ende-til-ende tester for webapplikasjoner. Vi bruker dette til å teste vår frontend.

Du kan lære mer om playwright [her](https://playwright.dev/).

For å kjøre tester lokalt, må du først ha installert Playwright. Det gjør du med:

```bash
npx playwright install
```

Når du har installert playwright, kan du kjøre tester med:

```bash
npm run test:e2e
```

For å kjøre tester med et brukergrensesnitt, kjør:

```bash
npm run test:e2e:ui
```

## Mocking av data

Vi har alle API-mocker i egne filer per endepunkt i `tests/mocks`, som du kan velge å bruke i testene dine. Du kan se hvordan man mocker i [dokumentasjonen til Playwright](https://playwright.dev/docs/mock).