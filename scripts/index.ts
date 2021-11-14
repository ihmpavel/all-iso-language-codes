import fetch from 'node-fetch'
import fs from 'fs'

const URL = 'https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab'

const main = async () => {
  const data_639_1: Record<string, Record<string, string>> = {}

  const req = await fetch(URL)
  const res = await req.text()

  // ignore header
  const [, ...rawData] = res.split('\r\n')
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
        // @ts-expect-error Trust me
        const translation = new Intl.DisplayNames([language], { type: 'language' }).of(l)
        // @ts-expect-error Translation
        data_639_1[language][l] =
          translation === l
            ? // @ts-expect-error Trust me
              new Intl.DisplayNames(['en'], { type: 'language' }).of(l)
            : translation
      })

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      fs.writeFileSync(`${dir}/639-1.json`, JSON.stringify(data_639_1[language], null, 2))
    }

    let englishName = row.englishName
    const nativeName =
      // @ts-expect-error Intl TD error
      new Intl.DisplayNames([row['639-3']], { type: 'language' }).of(row['639-3']) || null
    const tempEnglishName =
      // @ts-expect-error Intl TD error
      new Intl.DisplayNames(['en'], { type: 'language' }).of(row['639-3']) || null
    if (tempEnglishName !== row.englishName && tempEnglishName !== row['639-3']) {
      englishName = tempEnglishName
    }
    return {
      ...row,
      nativeName: nativeName !== row['639-3'] ? nativeName : englishName,
      englishName,
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
