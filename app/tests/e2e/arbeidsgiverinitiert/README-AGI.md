# AGI Playwright Tester

Arbeidsgiverinitiert (AGI) inntektsmelding - 24 Playwright E2E tester totalt.

## Testfiler

- `agi-happy-path.spec.tsx` (3 tester) - Komplett flyt fra start til slutt
- `agi-valideringer.spec.tsx` (8 tester) - Valideringsregler og feilhåndtering  
- `agi-forste-fravaersdag-validering.spec.tsx` (5 tester) - Dato-validering før oppsummering
- `agi-ulike-scenarier.spec.tsx` (8 tester) - Edge cases og alternative flyter

## Kjøre tester

```bash
# Alle AGI-tester
npm run test:e2e -- tests/e2e/arbeidsgiverinitiert/

# Spesifikk test
npm run test:e2e -- agi-happy-path
npm run test:e2e -- agi-valideringer

# Med Playwright UI for debugging
npm run test:e2e:ui

# Kun AGI-tester med grep
npm run test:e2e -- --grep "AGI"
```

## Playwright-funksjoner

Testene bruker:
- **Auto-waiting** - Venter automatisk på elementer
- **Network mocking** - Mocker alle API-kall
- **Screenshots** ved feil for debugging
- **Retry-logikk** for flaky tester

## AGI-flyt

1. **Opprett** → Velg årsak, fyll fødselsnummer og første fraværsdag
2. **Dine opplysninger** → Kontaktinfo
3. **Refusjon** → Første fraværsdag med refusjon, velg refusjonstype
4. **Oppsummering** → Gjennomgå og send inn
5. **Kvittering** → Bekreftelse

## Testdata

- Fødselsnummer: `09810198874`
- Arbeidsgiver: NAV (974652293)
- Ytelse: PLEIEPENGER_SYKT_BARN

## Mock-endepunkter

- `**/*/arbeidsgiverinitiert/arbeidsforhold` - Person-oppslag
- `**/*/arbeidsgiverinitiert/opplysninger` - AGI-opplysninger
- `**/*/imdialog/send-inntektsmelding/arbeidsgiverinitiert-nyansatt` - Innsending
