import { Paragraph, TextRun, AlignmentType } from 'docx'
import type { DocumentConfig } from '@/types/config'
import { FONT_SIZE, FONT_FAMILY, CHAR_WIDTH_TWIP, LINE_SPACING_TWIP } from '@/constants/jhu'
import { cmToTwip } from '@/constants/units'

/** 根据配置创建正文段落样式 */
export function createBodyParagraph(text: string, config: DocumentConfig): Paragraph {
  return new Paragraph({
    spacing: {
      line: LINE_SPACING_TWIP,
      lineRule: 'exact',
    },
    indent: {
      firstLine: config.body.firstLineIndent * CHAR_WIDTH_TWIP,
    },
    children: [
      new TextRun({
        text,
        font: {
          eastAsia: config.body.fontFamily,
          ascii: config.westernFont,
          hAnsi: config.westernFont,
        },
        size: config.body.fontSize,
      }),
    ],
  })
}

/** 创建标题段落 */
export function createHeadingParagraph(
  text: string,
  level: 1 | 2 | 3,
  config: DocumentConfig,
): Paragraph {
  const headingConfig = level === 1 ? config.heading1 : level === 2 ? config.heading2 : config.heading3
  return new Paragraph({
    alignment: headingConfig.alignment === 'center' ? AlignmentType.CENTER
      : headingConfig.alignment === 'right' ? AlignmentType.RIGHT
      : headingConfig.alignment === 'justify' ? AlignmentType.JUSTIFIED
      : AlignmentType.LEFT,
    indent: headingConfig.indentChars > 0
      ? { left: headingConfig.indentChars * CHAR_WIDTH_TWIP }
      : undefined,
    spacing: {
      line: LINE_SPACING_TWIP,
      lineRule: 'exact',
    },
    children: [
      new TextRun({
        text,
        bold: true,
        font: {
          eastAsia: headingConfig.fontFamily,
          ascii: config.westernFont,
          hAnsi: config.westernFont,
        },
        size: headingConfig.fontSize,
      }),
    ],
  })
}

/** 创建居中文本（封面题目、署名信息等） */
export function createCenteredText(
  text: string,
  fontFamily: string,
  fontSize: number,
  westernFont: string,
  bold = false,
): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text,
        bold,
        font: {
          eastAsia: fontFamily,
          ascii: westernFont,
          hAnsi: westernFont,
        },
        size: fontSize,
      }),
    ],
  })
}

/** 创建图/表题注 */
export function createCaption(text: string, config: DocumentConfig): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text,
        font: {
          eastAsia: FONT_FAMILY.chineseHei,
          ascii: config.westernFont,
          hAnsi: config.westernFont,
        },
        size: FONT_SIZE.wu,
      }),
    ],
  })
}

/** 页面边距（twip） */
export function createMargins(config: DocumentConfig) {
  return {
    top: cmToTwip(config.margins.top),
    bottom: cmToTwip(config.margins.bottom),
    left: cmToTwip(config.margins.left),
    right: cmToTwip(config.margins.right),
  }
}
