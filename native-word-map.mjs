export const nativeWordRecordings=[
  {
    "key": "pt-BR:pão",
    "text": "pão",
    "locale": "pt-BR",
    "author": "Izaias Rodrigues / Association Shtooka",
    "region": "Belém, Brazil",
    "source": "https://fsi-languages.yojik.eu/audiocollections/archives/por-balm-izaias_flac.tar.xz",
    "license": "CC BY 3.0 US",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/us/",
    "changes": "Excerpt from “o pão”, starting at 0.44 s (after the article, before the p release); original word ending retained. 180 ms leading and 320 ms trailing silence; mono MP3 conversion.",
    "originalSha256": "26158cfbe711e46bb873150adbb77b3a1b1dd48f612e933a869dcfd5aa945969",
    "audioSha256": "78f26e5f5f2790e9fe54dca0802d5425adfba6b1737f305140bffa0f9fd7af74"
  },
  {
    "key": "pt-BR:mão",
    "text": "mão",
    "locale": "pt-BR",
    "author": "Myriam Dechamps / Bernadette Perrin-Riou / WimsEdu",
    "region": "São Paulo, Brazil",
    "source": "https://fsi-languages.yojik.eu/audiocollections/archives/por-wims-voc_flac.tar.xz",
    "license": "CC BY 3.0 US",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/us/",
    "changes": "Full standalone recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion.",
    "originalSha256": "36ac44c2f67faaaad4ee2bfdf7c36c9fc4b9d2c625068f465fe8ff43a4d345c7",
    "audioSha256": "80b4f74c37ce9944d53d065dc6e9bc1ac88b03fefa7622996396b945f44290a1"
  },
  {
    "key": "es-ES:pero",
    "text": "pero",
    "locale": "es-ES",
    "author": "Precision27 / Lingua Libre",
    "region": "Spanish; region not specified",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Precision27-pero.wav",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "changes": "Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.",
    "originalSha256": "2143a9584012309121cf156220b4f934891c68919bc9d02ca1b8aab7e9bd79cd",
    "audioSha256": "771237baee070ddaf98719f8aaa6c00e3e2c7e4c8d894152d33c6d258625baf3"
  },
  {
    "key": "es-ES:perro",
    "text": "perro",
    "locale": "es-ES",
    "author": "Millars / Lingua Libre",
    "region": "Spain",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Millars-perro.wav",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.",
    "originalSha256": "ef5750ea15817a5b620d66b8087b6f7046bf3f273c471650f4fa2f586d6aeb23",
    "audioSha256": "16e81dc30ed40a7175f2d3308a77c1156eab1e5d4faa8fcf9f911dec9168bcf9"
  },
  {
    "key": "es-ES:rojo",
    "text": "rojo",
    "locale": "es-ES",
    "author": "Rodelar / Lingua Libre",
    "region": "Spanish; region not specified",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Rodelar-rojo.wav",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.",
    "originalSha256": "9cfdd405efaea3c1dc25b88696734e66b67c74a635d47901bcc7015ab17db754",
    "audioSha256": "91253f790aaafe6f1cb23e5112d6fff6e82c16ce498d35804b9dc55c08fb53b6"
  },
  {
    "key": "es-ES:papa",
    "text": "papa",
    "locale": "es-ES",
    "author": "Millars / Lingua Libre",
    "region": "Spain",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Millars-papa.wav",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.",
    "originalSha256": "6d172df247e98cb1cb8dc26099b7896c9f3ee6ac4904e4ce8804e5a0c1bc87ec",
    "audioSha256": "412dd2316b84b2c6145217f7fda8540d6a0491d2ec843657c58de6e1db53d428"
  },
  {
    "key": "es-ES:papá",
    "text": "papá",
    "locale": "es-ES",
    "author": "Marreromarco / Lingua Libre",
    "region": "Spanish; region not specified",
    "source": "https://commons.wikimedia.org/wiki/File:LL-Q1321_(spa)-Marreromarco-pap%C3%A1.wav",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Full original recording preserved; 180 ms leading and 320 ms trailing silence; mono MP3 conversion. Adapted clip retains its source license.",
    "originalSha256": "ddfc03d876d179c58bd2d0c43b97d32ba3ea9e41faa1c64d11e7895630e0678f",
    "audioSha256": "72d43b7afb1d33794aad6ce373f21c82781bedd4d13c313b226e67af9d3510f5"
  }
];
const byKey=new Map(nativeWordRecordings.map(x=>[x.key,x]));
// NFC composes diacritics; never remove accents or perform fuzzy matching.
export const nativeWordEntry=(text,locale)=>byKey.get(locale+":"+String(text).normalize("NFC").trim());
