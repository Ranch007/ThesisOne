import type { Discipline } from './ast'

/** 页边距（单位 cm） */
export interface Margins {
  top: number
  bottom: number
  left: number
  right: number
}

/** 基本字体配置 */
export interface FontConfig {
  fontFamily: string
  fontSize: number
  /** 对齐方式 */
  alignment: 'left' | 'center' | 'right' | 'justify'
}

/** 标题格式配置 */
export interface HeadingConfig extends FontConfig {
  indentChars: number
}

/** 正文格式配置 */
export interface BodyConfig {
  fontFamily: string
  fontSize: number
  lineSpacing: number
  firstLineIndent: number
}

/** 页码配置 */
export interface PageNumberConfig {
  fontFamily: string
  fontSize: number
  position: 'right' | 'center'
  bodyStartPage: number
  useRomanForFront: boolean
}

/** 特殊选项 */
export interface SpecialOptions {
  figureTableByChapter: boolean
  formulaByChapter: boolean
  tocShowDotLeader: boolean
}

/** 参考文献章节格式 */
export interface RefSectionConfig {
  titleFont: string
  titleSize: number
  itemFont: string
  itemSize: number
}

/** 完整文档配置 */
export interface DocumentConfig {
  discipline: Discipline
  margins: Margins
  title: FontConfig
  heading1: HeadingConfig
  heading2: HeadingConfig
  heading3: HeadingConfig
  body: BodyConfig
  westernFont: string
  pageNumber: PageNumberConfig
  refSection: RefSectionConfig
  specialOptions: SpecialOptions
}
