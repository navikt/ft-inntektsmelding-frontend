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

Start frontenden ved å gå til `app`-mappen og kjøre `npm run dev`.

```bash
cd app && npm run dev
```

Nå, det litt morsomme. Gå til [https://familie-inntektsmelding.intern.dev.nav.no/vite-on](https://familie-inntektsmelding.intern.dev.nav.no/vite-on) for å utvikle lokalt! 🤯
