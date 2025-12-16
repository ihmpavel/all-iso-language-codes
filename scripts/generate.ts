import fs from 'fs'

// https://github.com/unicode-org/icu/tree/2f8749a026f3ddc8cf54d4622480b7c543bb7fc0
const URL = 'https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab'
const OVERRIDES_PATH = './patches/overrides.json'

interface LanguageOverride {
  nativeName?: string | null
  englishName?: string | null
}

type OverridesMap = Record<string, LanguageOverride>

const loadOverrides = (): OverridesMap => {
  if (!fs.existsSync(OVERRIDES_PATH)) {
    return {}
  }
  try {
    const content = fs.readFileSync(OVERRIDES_PATH, 'utf-8')
    const data = JSON.parse(content)
    // Filter out schema and comment fields
    const overrides: OverridesMap = {}
    for (const [key, value] of Object.entries(data)) {
      if (!key.startsWith('$')) {
        overrides[key] = value as LanguageOverride
      }
    }
    return overrides
  } catch (error) {
    console.warn('Warning: Could not load overrides file:', error)
    return {}
  }
}

const main = async () => {
  const overrides = loadOverrides()
  const data_639_1: Record<string, Record<string, string>> = {}

  const req = await fetch(URL)
  const res = await req.text()

  // ignore header
  const [, ...rawData]: string[] = res.split('\n')
  rawData.pop() // remove last empty line

  // from the file header
  // Id, Part2B, Part2T, Part1, Scope, Language_Type, Ref_Name, Comment
  const rawRows = rawData.map(row => {
    const cols = row.split('\t')
    return {
      '639-3': cols[0] || null,
      '639-2B': cols[1] || null,
      '639-2T': cols[2] || null,
      '639-1': cols[3] || null,
      nativeName: null,
      englishName: cols[6] || null,
    }
  })

  const values_639_1 = rawRows.map(row => row['639-1']).filter(Boolean) as string[]
  const values_639_2B = rawRows.map(row => row['639-2B']).filter(Boolean) as string[]
  const values_639_2T = rawRows.map(row => row['639-2T']).filter(Boolean) as string[]
  const values_639_3 = rawRows.map(row => row['639-3']).filter(Boolean) as string[]

  const filtered_639_1 = rawRows.filter(row => row['639-1'])

  const dir = `./data`
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  const data_Advanced = rawRows.map(row => {
    if (row['639-1']) {
      const language = row['639-1']

      const dir = `./data/${language}`

      values_639_1.forEach(l => {
        if (!data_639_1[language]) {
          data_639_1[language] = {}
        }
        const translation = new Intl.DisplayNames([language], { type: 'language' }).of(l)
        // @ts-expect-error Translation
        data_639_1[language][l] =
          translation === l
            ? new Intl.DisplayNames(['en'], { type: 'language' }).of(l)
            : translation
      })

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      fs.writeFileSync(`${dir}/639-1.json`, JSON.stringify(data_639_1[language], null, 2))
    }

    let englishName = row.englishName
    const nativeName =
      new Intl.DisplayNames([row['639-3'] ?? ''], { type: 'language' }).of(row['639-3'] ?? '') ||
      null
    const tempEnglishName =
      new Intl.DisplayNames(['en'], { type: 'language' }).of(row['639-3'] ?? '') || null
    if (tempEnglishName !== row.englishName && tempEnglishName !== row['639-3']) {
      englishName = tempEnglishName
    }

    // Apply overrides from patches if available
    const code639_3 = row['639-3']
    const override = code639_3 ? overrides[code639_3] : undefined

    let finalNativeName = nativeName !== row['639-3'] ? nativeName : englishName
    let finalEnglishName = englishName

    if (override) {
      if (override.nativeName !== undefined) {
        finalNativeName = override.nativeName
      }
      if (override.englishName !== undefined) {
        finalEnglishName = override.englishName
      }
    }

    return {
      ...row,
      nativeName: finalNativeName,
      englishName: finalEnglishName,
    }
  })

  fs.writeFileSync(`${dir}/advanced.json`, JSON.stringify(data_Advanced, null, 2))
  fs.writeFileSync(
    `./src/imports.ts`,
    `${filtered_639_1
      .map(row => `import ${row['639-1']} from '.${dir}/${row['639-1']}/639-1.json'`)
      .join('\n')}\n\nexport default { ${filtered_639_1.map(row => row['639-1']).join(', ')} }`
  )

  // custom helpers
  fs.writeFileSync(
    `${dir}/all.json`,
    JSON.stringify(
      {
        '639-1': values_639_1,
        '639-2B': values_639_2B,
        '639-2T': values_639_2T,
        '639-3': values_639_3,
        // all: [...new Set([values_639_1, values_639_2B, values_639_2T, values_639_3])],
      },
      null,
      2
    )
  )
}

main()
