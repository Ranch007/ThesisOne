import type { DocumentConfig } from '@/types/config'
import type { CoverInfo, BackCoverInfo } from '@/types/cover'
import { Discipline } from '@/types/ast'
import { DEFAULT_MARGINS, FONT_FAMILY, FONT_SIZE, LINE_SPACING_TWIP } from './jhu'

/**
 * 江汉大学本科毕业论文排版默认配置
 *
 * 每当用户点击"恢复默认值"时，即恢复为此对象的值。
 */
export const DEFAULT_CONFIG: DocumentConfig = {
  discipline: Discipline.SOCIAL_SCIENCE,

  margins: { ...DEFAULT_MARGINS },

  title: {
    fontFamily: FONT_FAMILY.chineseHei,
    fontSize: FONT_SIZE.xiaoEr,
    alignment: 'center',
  },

  heading1: {
    fontFamily: FONT_FAMILY.chineseHei,
    fontSize: FONT_SIZE.san,
    alignment: 'center',
    indentChars: 0,
  },

  heading2: {
    fontFamily: FONT_FAMILY.chineseHei,
    fontSize: FONT_SIZE.si,
    alignment: 'left',
    indentChars: 2,
  },

  heading3: {
    fontFamily: FONT_FAMILY.chineseHei,
    fontSize: FONT_SIZE.xiaoSi,
    alignment: 'left',
    indentChars: 2,
  },

  body: {
    fontFamily: FONT_FAMILY.chineseSong,
    fontSize: FONT_SIZE.xiaoSi,
    lineSpacing: LINE_SPACING_TWIP,
    firstLineIndent: 2,
  },

  westernFont: FONT_FAMILY.western,

  pageNumber: {
    fontFamily: FONT_FAMILY.chineseSong,
    fontSize: FONT_SIZE.wu,
    position: 'right',
    bodyStartPage: 1,
    useRomanForFront: false,
  },

  refSection: {
    titleFont: FONT_FAMILY.chineseHei,
    titleSize: FONT_SIZE.si,
    itemFont: FONT_FAMILY.chineseSong,
    itemSize: FONT_SIZE.wu,
  },

  specialOptions: {
    figureTableByChapter: true,
    formulaByChapter: true,
    tocShowDotLeader: true,
  },

  cover: {
    university: '江汉大学',
    college: '',
    major: '',
    thesisTitle: '',
    studentName: '',
    studentId: '',
    advisor: '',
    submissionDate: new Date().toISOString().split('T')[0],
  } as CoverInfo,

  backCover: {
    declarationText: '本人郑重声明：所呈交的毕业论文（设计）是本人在指导教师指导下独立完成的。本人完全了解江汉大学有关保留、使用毕业论文（设计）的规定，同意学校保留并向有关部门或机构送交论文的复印件和电子版。',
    hasSignature: true,
  } as BackCoverInfo,
}
