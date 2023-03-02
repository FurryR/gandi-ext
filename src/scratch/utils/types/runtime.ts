export interface TranslationMap {
  [lang: string]: {
    [key: string]: string | undefined
  } | undefined
}
export type Runtime = undefined // Scratch 将不提供 Runtime。