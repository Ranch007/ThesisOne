import { ReferenceType } from '@/types/reference'
import type { ReferenceItem } from '@/types/reference'

/** 按 GB/T 7714 格式输出参考文献条目 */
export function formatGB7714(ref: ReferenceItem): string {
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

/** 格式化整型引用列表 */
export function formatReferenceList(items: ReferenceItem[]): string[] {
  return items
    .sort((a, b) => a.index - b.index)
    .map((ref) => `[${ref.index}] ${formatGB7714(ref)}`)
}
