# Playwright Tester

End-to-end tester for inntektsmelding-frontend. Testmappen er organisert etter samme struktur som `src/features/`.

## Struktur

```
tests/
├── e2e/                         # Playwright E2E tester
│   ├── arbeidsgiverinitiert/    # AGI-tester (24 tester)
│   ├── inntektsmelding/         # Vanlige inntektsmelding-tester (8 tester)
│   └── shared/                  # Delte tester (1 test)
└── mocks/                       # Mock-data for API-endepunkter
    ├── arbeidsgiverinitiert/    # AGI-spesifikke mocks
    ├── inntektsmelding/         # Inntektsmelding-mocks
    └── shared/                  # Delte mocks og utilities
```

## Kjøre tester

```bash
# Alle tester
npm run test:e2e

# Feature-spesifikke tester
npm run test:e2e -- tests/e2e/arbeidsgiverinitiert/
npm run test:e2e -- tests/e2e/inntektsmelding/

# Spesifikk testfil
npm run test:e2e -- agi-happy-path
npm run test:e2e -- happy-path

# Med UI for debugging
npm run test:e2e:ui

# Kun headless (raskere)
npm run test:e2e -- --headed=false
```

## Playwright-oppsett

Testene bruker Playwright med:
- **Chromium** som standard browser
- **Automatisk mocking** av API-endepunkter
- **Page Object Model** for gjenbrukbare komponenter
- **Parallell kjøring** for raskere tester

## Mock-system

Alle API-kall mockes automatisk:
- `mockOpplysninger()` - Mocker opplysninger-endepunkt
- `mockGrunnbeløp()` - Mocker grunnbeløp fra G-API
- `mockHentPersonOgArbeidsforhold()` - Mocker person-oppslag
- `mockAGIOpplysninger()` - Mocker AGI-spesifikke endepunkter

## Nye tester

- **Feature-tester** → `tests/e2e/{feature}/`
- **Delte tester** → `tests/e2e/shared/`
- **Mocks** → `tests/mocks/{feature}/` eller `tests/mocks/shared/`

## Debugging

```bash
# Kjør med UI for å se hva som skjer
npm run test:e2e:ui

# Kjør spesifikk test med debug
npm run test:e2e -- agi-happy-path --debug

# Se test-rapport etter kjøring
npx playwright show-report
```