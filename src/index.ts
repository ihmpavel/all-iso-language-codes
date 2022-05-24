import * as languageImports639_1 from './imports'
import advanced from '../data/advanced.json'
import all from '../data/all.json'

export type IsoType = keyof typeof all

const finder = (isoType: IsoType, code: string) => advanced.find(obj => obj[isoType] === code)

// https://stackoverflow.com/a/37511463
const normalizeString = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const getCodeHelper = (code: string, availableIsoTypes?: IsoType[] | null) => {
  let found = null
  if ((availableIsoTypes?.includes('639-3') || !availableIsoTypes) && !found) {
    found = finder('639-3', code)
  }
  if ((availableIsoTypes?.includes('639-2T') || !availableIsoTypes) && !found) {
    found = finder('639-2T', code)
  }
  if ((availableIsoTypes?.includes('639-2B') || !availableIsoTypes) && !found) {
    found = finder('639-2B', code)
  }
  if ((availableIsoTypes?.includes('639-1') || !availableIsoTypes) && !found) {
    found = finder('639-1', code)
  }
  return found
}

const getNameHelper = (code: string, language?: string): string | null => {
  const found = getCodeHelper(code)

  if (!found) {
    return null
  }

  if (
    found?.['639-1'] &&
    typeof language !== 'undefined' &&
    (language !== 'en' || language !== found['639-1'])
  ) {
    // @ts-expect-error Trust me this is the only way to do this
    return languageImports639_1.default?.[language]?.[`${found?.['639-1']}`] || null
  }

  return language === 'en' ? found?.englishName : found?.nativeName ?? null
}

export const getEnglishName = (code: string) => getName(code)
export const getName = (code: string, language = 'en') => getNameHelper(code, language)
export const getNativeName = (code: string) => getNameHelper(code)

export const isValid = (code: string, availableIsoTypes?: IsoType[] | null, moreInfo = false) => {
  const found = getCodeHelper(code, availableIsoTypes)
  let iso: IsoType | null = null

  if (found?.['639-1']) {
    iso = '639-1'
  } else if (found?.['639-2T']) {
    iso = '639-2T'
  } else if (found?.['639-2B']) {
    iso = '639-2B'
  } else if (found?.['639-3']) {
    iso = '639-3'
  }

  return moreInfo
    ? {
        iso,
        found: Boolean(iso),
      }
    : Boolean(iso)
}

export const getIsoCodesFromNativeName = (nativeName: string, normalizeName = false) => {
  const name = normalizeName ? normalizeString(nativeName) : nativeName

  const found = advanced.find(
    language =>
      (normalizeName ? normalizeString(language.nativeName) : language.nativeName) === name
  )
  const isoCodes = found
    ? Object.entries(found)
        .map(([key, value]) =>
          value && key !== 'nativeName' && key !== 'englishName' ? key : null
        )
        .filter(Boolean)
    : null

  return isoCodes as IsoType[] | null
}

export const getAll639_1 = () => all['639-1']
export const getAll639_2B = () => all['639-2B']
export const getAll639_2T = () => all['639-2T']
export const getAll639_3 = () => all['639-3']
