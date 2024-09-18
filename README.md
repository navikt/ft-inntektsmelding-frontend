# ft-inntektsmelding-frontend

Frontend for inntektsmelding for Team Foreldrepenger og Team Sykdom i Familien

## Arkitektur

Dette repoet er delt inn i to deler – en `app` og en `server`. `app` er frontenden, og `server` er en enkel Express-server som serverer frontenden.

## Utvikling

Klon ned repoet:

```bash
git clone git@github.com:navikt/ft-inntektsmelding-frontend.git
```

Gå inn i mappene `app` og `server` og kjør `npm install` for å installere avhengigheter.

```bash
cd app && npm install
cd ../server && npm install
```

Du trenger typisk ikke å starte serveren for å utvikle lokalt!

Start frontenden ved å gå til `app`-mappen og kjøre `npm run dev`.

```bash
cd app && npm run dev:fp
```

Gå til [https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/vite-on](https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/vite-on) for å utvikle lokalt!

Når den siden er besøkt, kan du gå til [https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/f29dcea7-febe-4a76-911c-ad8f6d3e8858](https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/f29dcea7-febe-4a76-911c-ad8f6d3e8858) for å logge på.

- Velg BankID
- Fødselsnummer: 10107400090
- Velg BankID med kodebrikke eller BankID med app – det har ikke noe å si
- Legg inn engangskode: otp
- Legg inn BankID passord: qwer1234

Når du har gjort alt dette, vil du se en inntektsmelding du kan endre på.

Det er også egne readmes for [appen](./app/README.md), [ende-til-ende-testing](./app/tests/README.md) og for [serveren](./server/README.md).
