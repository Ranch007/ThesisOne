/** 参考文献类型 */
export enum ReferenceType {
  JOURNAL = 'JOURNAL',
  BOOK = 'BOOK',
  CONFERENCE = 'CONFERENCE',
  THESIS = 'THESIS',
  PATENT = 'PATENT',
  NEWSPAPER = 'NEWSPAPER',
  ONLINE = 'ONLINE',
}

/** 参考文献条目 */
export interface ReferenceItem {
  id: string
  index: number
  type: ReferenceType
  authors: string[]
  title: string
  year: number
  journal?: string
  volume?: string
  issue?: string
  pages?: string
  publisher?: string
  address?: string
  doi?: string
  url?: string
  accessDate?: string
}

/** 引用校验结果 */
export interface CitationValidation {
  orphans: number[]
  unused: number[]
  isValid: boolean
}
