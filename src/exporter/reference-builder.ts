import { Paragraph, TextRun } from 'docx'
import type { ReferenceItem, DocumentConfig } from '@/types'
import { FONT_FAMILY } from '@/constants/jhu'
import { formatGB7714 } from '@/references/gbt7714'

/** 构建参考文献列表（GB/T 7714 格式） */
export function buildReferenceList(
  items: ReferenceItem[],
  config: DocumentConfig,
): Paragraph[] {
  return items
    .sort((a, b) => a.index - b.index)
    .map((ref) => createRefParagraph(ref, config))
}

function createRefParagraph(ref: ReferenceItem, config: DocumentConfig): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `[${ref.index}] `,
        font: {
          eastAsia: FONT_FAMILY.chineseSong,
          ascii: config.westernFont,
          hAnsi: config.westernFont,
        },
        size: config.refSection.itemSize,
      }),
      new TextRun({
        text: formatGB7714(ref),
        font: {
          eastAsia: FONT_FAMILY.chineseSong,
          ascii: config.westernFont,
          hAnsi: config.westernFont,
        },
        size: config.refSection.itemSize,
      }),
    ],
  })
}
