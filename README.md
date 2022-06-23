# List of ISO 639-1, 639-2T, 639-2B and 639-3 codes with translations in all available languages

Sometimes you need to get a fresh list of **639-1**, **639-2T**, **639-2B** or **639-3** language codes and their translations. Until now there was not an easy way to get them.

All data are available in `json` format in `data/[language]/639-1.json`. More formats might be available in the [future](#file-format).

## Usage
1) [JS functions](#js-functions) (with TS type definitions included)
2) Directly, using files located in [data folder](https://github.com/ihmpavel/all-iso-language-codes/tree/master/data)

### JS functions

| Function | Arguments | Return value | Example usage |
|---|---|---|---|
| `getEnglishName(code: string)` | `language code` | `string` &#124; `null` | `getEnglishName('cs')` => `Czech` |
| `getNativeName(code: string)` | `language code` | `string` &#124; `null` | `getNativeName('cs')` => `čeština` |
| `getName(code: string, language = 'en')` | `from language, to language?` | `string` &#124; `null` | `getName('cs', 'en')` => `Czech` |
| `isValid(code: string, availableIsoTypes?: IsoType[], moreInfo = false)` | `language code, IsoType (below table), moreInfo` | `boolean` &#124; `{ iso: IsoType` &#124; `null; found: boolean; }` | `isValid('cs')` => `true`, `isValid('cs', ['639-1'], true)` => `{ iso: '639-1'; found: true; }`, |
| `getIsoCodesFromNativeName(nativeName: string, normalizeString = false)` | `language name, should normalize string (lowercase and remove diacritics)` | `IsoType[]` &#124; `null` | `getIsoCodesFromNativeName('ČeŠtInA', true)` => `['639-3', '639-2B', '639-2T', '639-1']` |
| `getAll639_1()` | - | `string[]` (_639-1_ array) | `getAll639_1()` => `['aa', 'ab', 'af'...]` |
| `getAll639_2B()` | - | `string[]` (_639-2B_ array) | `getAll639_2B()` => `['aar', 'abk', 'ace'...]` |
| `getAll639_2T()` | - | `string[]` (_639-2T_ array) | `getAll639_2T()` => `['aar', 'abk', 'ace'...]` |
| `getAll639_3()` | - | `string[]` (_639-3_ array) | `getAll639_3()` => `['aaa', 'aab', 'aac'...]` |

`type IsoType = '639-1' | '639-2B' | '639-2T' | '639-3'`

### File format
If you have some ideas (`csv`, another `JSON` format...) let me know or create PR.

## Adding more languages
Language matrix is generated by `Node.js` `Intl` API (version 18.4.0). If you would like to edit something, Create PR in `Node.js` `Intl` API. Wait before release and run `yarn generate`.

## Tests
There are `jest` tests which tests basic functionality. Feel free to extend them.

## More info
Getting the list of all available languages is from [official list](https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab) 

## More packages from me
- [all-iso-language-codes](https://github.com/ihmpavel/all-iso-language-codes) - List of ISO 639-1, 639-2T, 639-2B and 639-3 codes with translations in all available languages
- [expo-video-player](https://github.com/ihmpavel/expo-video-player) - Customizable Video Player controls for Expo
- [free-email-domains-list](https://github.com/ihmpavel/free-email-domains-list) - Fresh list of all free email domain providers. Can be used to check if an email address belongs to a company. Updated weekly
