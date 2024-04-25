# Brukergrensesnitt for ft-inntektsmelding-frontend

For å bruke npm trenger du ha `node` installert.
Vi anbefaler at du bruker [asdf](https://asdf-vm.com/) slik at du automatisk kjører nødvendige pakker på støttet versjon.
`asdf` vil sette riktige versjoner for diverse pakker som trengs i dette repoet. Se `.tool-versions` i rot-folderen.

Etter at Node er installert kjører du følgende kommandoer for å starte:

```bash
npm install
npm run dev
```

## Logge inn med idporten i dev

Gå til https://familie-inntektsmelding.intern.dev.nav.no/
* Velg BankID
* Fødselsnummer: 10107400090
* Velg BankID med kodebrikke
* Legg inn engangskode: otp
* Klikk på «Velg annen BankId» og velg «BankId Norge – BankId»
* Legg inn BankID passord: qwer1234