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
  /** 用户粘贴的完整引用文本（如 "张三, 李四. 深度学习综述[J]. 计算机学报, 2020, 43(1): 1-20."） */
  rawText: string
  type?: ReferenceType
  authors?: string[]
  title?: string
  year?: number
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
