import { getEnglishName, getIsoCodesFromNativeName, getName, isValid } from '../src'

describe('Get name', () => {
  it('Code without language', () => {
    const name = getName('cs')
    expect(name).toEqual('Czech')
  })
  it('Code with language', () => {
    const name = getName('cs', 'cs')
    expect(name).toEqual('čeština')
  })
  it('Code with language to English', () => {
    const name = getName('cs', 'en')
    expect(name).toEqual('Czech')
  })
  it('Code with unknown language', () => {
    const name = getName('cs', 'something')
    expect(name).toEqual(null)
  })
  it('Code with unknown language from unknown language', () => {
    const name = getName('unknown', 'unknown')
    expect(name).toEqual(null)
  })
  it('Unknown code', () => {
    const name = getName('unknown')
    expect(name).toEqual(null)
  })
})

describe('Get English name', () => {
  it('Code', () => {
    const name = getEnglishName('cs')
    expect(name).toEqual('Czech')
  })
  it('Code 639-1', () => {
    const name = getEnglishName('cs')
    expect(name).toEqual('Czech')
  })
  it('Code 639-2T', () => {
    const name = getEnglishName('ces')
    expect(name).toEqual('Czech')
  })
  it('Code 639-2B', () => {
    const name = getEnglishName('cze')
    expect(name).toEqual('Czech')
  })
  it('Code 639-3', () => {
    const name = getEnglishName('ces')
    expect(name).toEqual('Czech')
  })
  it('Unknown code', () => {
    const name = getEnglishName('unknown')
    expect(name).toEqual(null)
  })
  it('Unknown code 639-1', () => {
    const name = getEnglishName('unknown')
    expect(name).toEqual(null)
  })
})

describe('Is valid', () => {
  it('Code 639-1', () => {
    const valid = isValid('cs')
    expect(valid).toEqual(true)
  })
  it('Code 639-3', () => {
    const valid = isValid('ces')
    expect(valid).toEqual(true)
  })
  it('Code 639-2B', () => {
    const valid = isValid('cze')
    expect(valid).toEqual(true)
  })
  it('Code 639-2T', () => {
    const valid = isValid('ces')
    expect(valid).toEqual(true)
  })
  it('Code 639-1 more info', () => {
    const valid = isValid('cs', null, true)
    expect(valid).toEqual({ found: true, iso: '639-1' })
  })
  it('Code 639-1 iso language', () => {
    const valid = isValid('cs', ['639-1'])
    expect(valid).toEqual(true)
  })
  it('Code 639-1 iso language unknown', () => {
    const valid = isValid('unknown', ['639-1'])
    expect(valid).toEqual(false)
  })
  it('Code 639-3 iso language', () => {
    const valid = isValid('cet', ['639-3'])
    expect(valid).toEqual(true)
  })
  it('Code 639-3 iso language multiple', () => {
    const valid = isValid('cet', ['639-1', '639-3'])
    expect(valid).toEqual(true)
  })
  it('Code 639-2T iso language', () => {
    const valid = isValid('cet', ['639-2T'])
    expect(valid).toEqual(false)
  })
  it('Code 639-1 iso language more info', () => {
    const valid = isValid('cs', ['639-1'], true)
    expect(valid).toEqual({ found: true, iso: '639-1' })
  })
  it('Code 639-1 iso language unknown more info', () => {
    const valid = isValid('unknown', ['639-1'], true)
    expect(valid).toEqual({ found: false, iso: null })
  })
  it('Code 639-3 iso language more info', () => {
    const valid = isValid('cet', ['639-3'], true)
    expect(valid).toEqual({ found: true, iso: '639-3' })
  })
  it('Code 639-3 iso language more info multiple', () => {
    const valid = isValid('cet', ['639-1', '639-3'], true)
    expect(valid).toEqual({ found: true, iso: '639-3' })
  })
  it('Code 639-2T iso language more info', () => {
    const valid = isValid('cet', ['639-2T'], true)
    expect(valid).toEqual({ found: false, iso: null })
  })
  it('Unknown code', () => {
    const valid = isValid('unknown')
    expect(valid).toEqual(false)
  })
  it('Unknown code more info', () => {
    const valid = isValid('unknown', null, true)
    expect(valid).toEqual({ found: false, iso: null })
  })
})

describe('Get ISO codes from native name', () => {
  it('Native name equal', () => {
    const codes = getIsoCodesFromNativeName('čeština')
    expect(codes).toEqual(['639-3', '639-2B', '639-2T', '639-1'])
  })
  it('Native name normalize easy', () => {
    const codes = getIsoCodesFromNativeName('Čeština', true)
    expect(codes).toEqual(['639-3', '639-2B', '639-2T', '639-1'])
  })
  it('Native name normalize hard', () => {
    const codes = getIsoCodesFromNativeName('ČeŠtInA', true)
    expect(codes).toEqual(['639-3', '639-2B', '639-2T', '639-1'])
  })
  it('Native name 639-3', () => {
    const codes = getIsoCodesFromNativeName('Centúúm')
    expect(codes).toEqual(['639-3'])
  })
  it('Native name normalize 639-3', () => {
    const codes = getIsoCodesFromNativeName('centuum', true)
    expect(codes).toEqual(['639-3'])
  })
  it('Unknown native name', () => {
    const codes = getIsoCodesFromNativeName('unknown')
    expect(codes).toEqual(null)
  })
  it('Unknown native name normalize', () => {
    const codes = getIsoCodesFromNativeName('unknown', true)
    expect(codes).toEqual(null)
  })
})

export {}
