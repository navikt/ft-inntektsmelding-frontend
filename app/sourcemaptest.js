import fs from "node:fs";

import sourceMap from "source-map-js";

// console.log(sourceMap);
const sourceMapParsed = JSON.parse(
  fs.readFileSync("./dist/assets/index-IdXOAZ9Y.js.map", "utf8"),
);

const stackTrace = `
  at (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:46:206)
  at ev (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:161)
  at Bk.s.componentDidCatch.n.callback (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:676)
  at Rb (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:76:15528)
  at Yb (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:31884)
  at nE (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:31464)
  at nE (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:31372)
  at cN (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:31014)
  at pN (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:40894)
  at Ls (https://arbeidsgiver.nav.no/fp-im-dialog/assets/index-IdXOAZ9Y.js:78:40254)
`;

// Initialize SourceMapConsumer and process the stack trace
(async () => {
  const consumer = await new sourceMap.SourceMapConsumer(sourceMapParsed);

  for (const line of stackTrace.split("\n")) {
    const match = line.match(/(\S+):(\d+):(\d+)/);
    if (match) {
      const [, , lineNum, columnNum] = match;

      const pos = consumer.originalPositionFor({
        line: Number.parseInt(lineNum, 10),
        column: Number.parseInt(columnNum, 10),
      });

      console.log(`Original position for ${line.trim()}:`);
      console.log(`  Source: ${pos.source}`);
      console.log(`  Line: ${pos.line}`);
      console.log(`  Column: ${pos.column}`);
      console.log(`  Name: ${pos.name}\n`);
    }
  }
})();
