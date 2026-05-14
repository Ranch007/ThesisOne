import { Paragraph, TextRun } from 'docx'
import type { ReferenceItem, DocumentConfig } from '@/types'
import { ReferenceType } from '@/types'
import { FONT_FAMILY } from '@/constants/jhu'

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
        text: formatReference(ref),
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

/** 按 GB/T 7714 格式化单条文献 */
export function formatReference(ref: ReferenceItem): string {
  const authors = ref.authors.join(', ')
  const base = `${authors}. ${ref.title}`

  switch (ref.type) {
    case ReferenceType.JOURNAL:
      return `${base}[J]. ${ref.journal ?? ''}, ${ref.year}, ${ref.volume ?? ''}${ref.issue ? `(${ref.issue})` : ''}${ref.pages ? `: ${ref.pages}` : ''}.`

    case ReferenceType.BOOK:
      return `${base}[M]. ${ref.address ? `${ref.address}: ` : ''}${ref.publisher ?? ''}, ${ref.year}.`

    case ReferenceType.CONFERENCE:
      return `${base}[C]. ${ref.address ?? ''}, ${ref.year}${ref.pages ? `: ${ref.pages}` : ''}.`

    case ReferenceType.THESIS:
      return `${base}[D]. ${ref.address ?? ''}: ${ref.journal ?? ''}, ${ref.year}.`

    case ReferenceType.PATENT:
      return `${base}[P]. ${ref.address ?? ''}, ${ref.year}.`

    case ReferenceType.NEWSPAPER:
      return `${base}[N]. ${ref.journal ?? ''}, ${ref.year}${ref.pages ? `(${ref.pages})` : ''}.`

    case ReferenceType.ONLINE:
      return `${base}[EB/OL]. ${ref.url ?? ''}, ${ref.year}${ref.accessDate ? `(${ref.accessDate})` : ''}.`

    default:
      return `${base}.`
  }
}
