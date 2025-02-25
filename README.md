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

Start frontenden ved å gå til `app`-mappen og kjøre `npm run dev:fp` eller `npm run dev:k9`.

```bash
cd app && npm run dev:fp
```

## Inntektsmelding

1) For FP, gå til [https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/vite-on](https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/vite-on) for å utvikle lokalt!
   For K9 [https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/vite-on](https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/vite-on)
   [Dokumentasjon for kobling mot lokal devserver](https://github.com/navikt/vite-mode)

2) Logg inn! Her vil du få muligheten til å velge hvilken testbruker du ønsker å logge inn med. Følg guiden for testbrukere under.

3) Finn uløste og tidligere innsendte inntektsmeldinger på https://arbeidsgiver.intern.dev.nav.no/min-side-arbeidsgiver/saksoversikt på temaet du vil teste.

## Refusjon for omsorgspenger

1) Gå til [https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/vite-on](https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/vite-on) for å gå mot vite devserver.
   [Dokumentasjon for kobling mot lokal devserver](https://github.com/navikt/vite-mode)
 
2) Logg inn! Følg guiden for testbrukere under.

3) Gå mot denne [URLen](https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/refusjon-omsorgspenger/${ORGNR}/1-intro).
   Bytt ut ${ORGNR} med orgnummeret som er knyttet til testbrukeren du logget inn med.
   


## Testbrukere

- Velg TestID
- Personidentifikator: En fra listen under
- Trykk Autentiser
    
Tilgjengelige test-arbeidsgivere:
* Orgnr: 315786940 - HERLIG SPRUDLENDE TIGER AS. Kontaktperson hos arbeidsgiver: 16878397960 - KLAR JORDBÆR
* Orgnr: 311204645- SAMARBEIDSVILLING HES TIGER. Kontaktperson hos arbeidsgiver: 12918998479 - ENKEL KATETER
* Orgnr: 311343483 - DYNAMISK OPPSTEMT HAMSTER KF. Kontaktperson hos arbeidsgiver: 25899099616 TILFREDSSTILLENDE ARK
* Orgnr: 315630304 - LAV BLØT KATT MOSKUS. Kontaktperson hos arbeidsgiver:22810699640 FANTASILØS LAMPE
* Orgnnr: 311536753- TROSSIG NATURSTRIDIG TIGER AS. Kontaktperson hos arbeidsgiver: 09810198874 UTØRST GALLUPMÅLING
* Orgnr: 315853370 - INTERESSANT INTUITIV KATT DIAMETER. Kontaktperson hos arbeidsgiver: 09810198874 UTØRST GALLUPMÅLING


Testbruker delt med sykepenger

PS: Vet ikke om denne brukeren har noe use case lenger. Ser ut som den mangler tilganger

- Velg BankID
- Fødselsnummer: 10107400090
- Velg BankID med kodebrikke eller BankID med app – det har ikke noe å si
- Legg inn engangskode: otp
- Legg inn BankID passord: qwer1234

Det er også egne readmes for [appen](./app/README.md), [ende-til-ende-testing](./app/tests/README.md) og for [serveren](./server/README.md).

## Kode generert av GitHub Copilot
Dette repoet bruker GitHub Copilot til å generere kode.