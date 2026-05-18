import { Paragraph, TextRun, Tab } from 'docx'
import type { DocumentNode, DocumentConfig } from '@/types'
import { FONT_FAMILY, FONT_SIZE, CHAR_WIDTH_TWIP } from '@/constants/jhu'

/** 构建目录段落列表 */
export function buildTOC(
  headings: DocumentNode[],
  _config: DocumentConfig,
  hasZhAbstract: boolean,
  hasEnAbstract: boolean,
  backTitles: string[] = [],
): Paragraph[] {
  const paragraphs: Paragraph[] = []

  if (hasZhAbstract) {
    paragraphs.push(createTOCEntry('中文摘要', 'I', 1))
  }
  if (hasEnAbstract) {
    paragraphs.push(createTOCEntry('Abstract', 'II', 1))
  }

  for (const h of headings) {
    const level = h.level ?? 1
    const indent = (level - 1) * 2
    paragraphs.push(createTOCEntry(h.text, '', level, indent))
  }

  for (const title of backTitles) {
    paragraphs.push(createTOCEntry(title, '', 1))
  }

  return paragraphs
}

function createTOCEntry(
  text: string,
  pageNum: string,
  _level: number,
  indentChars = 0,
): Paragraph {
  return new Paragraph({
    indent: indentChars > 0 ? { left: indentChars * CHAR_WIDTH_TWIP } : undefined,
    tabStops: [{ type: 'right', position: 8000 }],
    children: [
      new TextRun({
        text,
        font: { eastAsia: FONT_FAMILY.chineseSong },
        size: FONT_SIZE.xiaoSi,
      }),
      new TextRun({
        children: [new Tab()],
      }),
      new TextRun({
        text: pageNum,
        font: { eastAsia: FONT_FAMILY.chineseSong },
        size: FONT_SIZE.xiaoSi,
      }),
    ],
  })
}
