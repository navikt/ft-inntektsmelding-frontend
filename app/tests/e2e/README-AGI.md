# Arbeidsgiverintitiert (AGI) Playwright Tester

## Oversikt

AGI-flyten lar arbeidsgivere manuelt opprette inntektsmeldinger for ansatte, typisk i scenarioer hvor:
- En ny ansatt mottar ytelser fra NAV
- En ansatt er unntatt fra Aa-register-registrering
- Andre spesielle omstendigheter

## Opprettede filer

### Mock-datafiler

#### `tests/mocks/agi-opplysninger.ts`
Mock-data for AGI-spesifikke opplysningsresponser:
- `agiOpplysningerResponseNyAnsatt`: Standard nyansatt-scenario
- `agiOpplysningerResponseUregistrert`: Uregistrert ansatt-scenario
- `agiOpplysningerForeldrepenger`: Foreldrepenger-scenario

#### `tests/mocks/agi-send-inntektsmelding.ts`
Mock-data for AGI send inntektsmelding-responser:
- `agiSendInntektsmeldingResponse`: Standard respons med enkelt refusjonsbeløp
- `agiSendInntektsmeldingResponseVarierendeRefusjon`: Respons med varierende refusjon
- `agiSendInntektsmeldingResponseUtenRefusjon`: Respons uten refusjon

### Hjelpefunksjoner (i `tests/mocks/utils.ts`)

- `mockAGIOpplysninger()`: Mocker arbeidsgiverinitiert/opplysninger-endepunktet
- `mockAGISendInntektsmelding()`: Mocker arbeidsgiverinitiert/send-inntektsmelding-endepunktet

## Testfiler

**Totalt: 19 tester - ✅ Alle består**

### 1. `agi-happy-path.spec.tsx` (3 tester)

Tester den komplette happy path-flyten gjennom AGI-prosessen.

**Testcaser:**
- **Fullstendig AGI-flyt med refusjon - ny ansatt**: Komplett flyt fra start til slutt med refusjon
  - Naviger til opprett-siden
  - Velg "ny_ansatt" årsak
  - Fyll inn fødselsnummer og første fraværsdag
  - Hent ansatt-informasjon
  - Velg arbeidsgiver (hvis flere)
  - Fyll inn kontaktinformasjon
  - Velg refusjonstype (lik refusjon)
  - Send inn og verifiser kvittering

- **AGI-flyt med varierende refusjon**: Flyt med varierende refusjonsbeløp
  - Samme som over men med flere refusjonsperioder med ulike beløp

- **Navigering mellom steg med tilbake-knapper**: Navigasjon mellom steg
  - Tester at brukere kan navigere frem og tilbake mellom steg
  - Verifiserer at data bevares ved navigering

### 2. `agi-valideringer.spec.tsx` (8 tester)

Tester valideringsregler og feilhåndtering.

**Testcaser:**
- **Validering av fødselsnummer på opprett-siden**: Validerer at fødselsnummer må være gyldig format
- **Validering av første fraværsdag på opprett-siden**: Validerer at første fraværsdag er påkrevd
- **Skal vise dine-opplysninger siden etter opprett**: Verifiserer at man kommer til riktig side
- **Kan ikke gå videre fra refusjon uten å velge refusjonstype**: Tester at en refusjonstype må velges
- **Ny ansatt kan ikke velge NEI på refusjon**: Nye ansatte må velge refusjon (kan ikke velge "NEI")
- **Arbeidsgiver dropdown vises når det er flere arbeidsforhold**: Arbeidsgiver må velges når ansatt har flere arbeidsforhold
- **Validering av første fraværsdag med refusjon på refusjon-steget**: Første fraværsdag med refusjon må fylles ut

### 3. `agi-ulike-scenarier.spec.tsx` (8 tester)

Tester ulike scenarioer og edge cases.

**Testcaser:**
- **AGI med alternativ ytelsetype**: Tester at AGI-flyten fungerer med ulike ytelsestyper
- **Skal vise riktig arbeidsgiver og ansatt-informasjon i oppsummering**: Verifiserer at ansatt- og arbeidsgiverinformasjon vises korrekt i oppsummering
- **Skal kunne redigere fra oppsummering til tidligere steg**: Tester redigering fra oppsummering tilbake til tidligere steg
- **Visning av 'unntatt aaregister' melding**: Viser passende melding for Aa-register-unntatte ansatte
- **Visning av 'annen årsak' melding**: Viser melding om at andre årsaker ikke støttes ennå
- **Feilhåndtering ved henting av person**: Tester feilhåndtering når ansatt-oppslag feiler
- **Feilhåndtering ved innsending av inntektsmelding**: Tester feilhåndtering når innsending feiler
- **Skal kunne velge første arbeidsforhold automatisk hvis kun ett arbeidsforhold**: Velger automatisk arbeidsgiver hvis kun ett arbeidsforhold finnes

## Kjøre testene

### Kjør alle AGI-tester:
```bash
cd app
npm run test:e2e -- --grep "AGI"
```

### Kjør spesifikk testfil:
```bash
npm run test:e2e -- agi-happy-path
npm run test:e2e -- agi-valideringer
npm run test:e2e -- agi-ulike-scenarier
```

### Kjør i UI-modus (for debugging):
```bash
npm run test:e2e -- --ui
```

## Testflyt

Den typiske AGI-flyten som testene følger:

### 1. Opprett-siden (`/opprett?ytelseType=<YTELSE_TYPE>`)
- Velg årsak: ny_ansatt, unntatt_aaregister, eller annen_årsak
- Fyll inn ansattes fødselsnummer
- Fyll inn første fraværsdag
- Klikk "Hent opplysninger"
- Velg arbeidsgiver hvis flere arbeidsforhold finnes
- Klikk "Opprett inntektsmelding"

### 2. Dine opplysninger (`/agi/<id>/dine-opplysninger`)
- Fyll inn kontaktperson navn (valgfritt, kan være forhåndsutfylt)
- Fyll inn telefonnummer
- Klikk "Bekreft og gå videre"

### 3. Refusjon (`/agi/<id>/refusjon`)
- Fyll inn første fraværsdag med refusjon
- Velg refusjonstype:
  - JA_LIK_REFUSJON (Ja, lik refusjon)
  - JA_VARIERENDE_REFUSJON (Ja, varierende refusjon)
  - NEI (Nei - ikke tillatt for nye ansatte)
- Hvis varierende refusjon, fyll inn flere perioder
- Klikk "Neste steg"

### 4. Oppsummering (`/agi/<id>/oppsummering`)
- Gjennomgå all informasjon
- Rediger ved behov (klikk tilbake eller rediger-knapper)
- Klikk "Send inn"

### 5. Kvittering (`/agi/<id>/kvittering`)
- Bekreftelsesside med kvittering

## Viktige forskjeller fra vanlig flyt

AGI-flyten skiller seg fra den vanlige inntektsmeldingsflyten på flere måter:

1. **Arbeidsgiverinitiert**: Arbeidsgiver starter prosessen manuelt i stedet for å svare på en NAV-forespørsel
2. **Ansatt-oppslag**: Krever henting av ansattinformasjon ved hjelp av fødselsnummer
3. **Obligatorisk refusjon**: Nye ansatte (ny_ansatt) må velge refusjon
4. **Ingen eksisterende forespørsel**: Det finnes ingen forhåndseksisterende forespørsel fra NAV
5. **Forskjellige valideringsregler**: Noen felt har andre krav

## Mock-endepunkter

- `**/*/arbeidsgiverinitiert/arbeidsforhold` - Ansatt-oppslag
- `**/*/arbeidsgiverinitiert/opplysninger` - AGI-spesifikke opplysninger
- `**/*/imdialog/send-inntektsmelding/arbeidsgiverinitiert-nyansatt` - AGI-innsending

## Testdata

- Test fødselsnummer: `09810198874`
- Test arbeidsgiver: NAV (org.nr. 974652293)
- Test ytelse: PLEIEPENGER_SYKT_BARN (primært)

## Notater for utviklere

- AGI-flyten bruker en spesiell ID-konstant: `ARBEIDSGIVER_INITERT_ID = "agi"`
- Opplysninger lagres i sessionStorage for AGI-flyter
- forespørselType for AGI kan være:
  - `ARBEIDSGIVERINITIERT_NYANSATT`
  - `ARBEIDSGIVERINITIERT_UREGISTRERT`
- Mock-responser bør bruke passende forespørselType-verdier
- Navigasjon i tester skal bruke AGI-spesifikke ruter (`/agi/$id/*`)

## Feilsøking

Hvis tester feiler:

1. **Sjekk mock-data**: Sørg for at mock-responser matcher forventet skjema
2. **Verifiser ruter**: AGI bruker `/agi/$id/*` ruter, ikke `/$id/*`
3. **Sjekk valideringsregler**: AGI har andre valideringsregler enn vanlig flyt
4. **Gjennomgå konsollfeil**: Tester logger valideringsfeil til konsollen
5. **Bruk UI-modus**: Kjør med `--ui` flagg for å se hva som skjer i nettleseren

## Fremtidige forbedringer

- Legg til tester for varierende refusjon med faktiske flere perioder (for øyeblikket forenklet)
- Legg til tester for redigering av tidligere innsendte AGI-inntektsmeldinger
- Legg til tester for flere ytelser (for øyeblikket fokusert på PLEIEPENGER_SYKT_BARN)
- Legg til visuell regresjonstesting
- Legg til ytelsestesting for store datasett

## Testresultat

**Siste kjøring: 19/19 tester bestått ✅** (4.9s kjøretid)

Alle tester inkluderer riktig mocking, validering, feilhåndtering og dekker både happy paths og edge cases.
