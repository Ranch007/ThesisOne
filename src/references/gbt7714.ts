import { ReferenceType } from '@/types/reference'
import type { ReferenceItem } from '@/types/reference'

/** GB/T 7714 作者格式化：≤3人全列，>3人列前3人加"等"/"et al." */
function formatAuthors(authors: string[]): string {
  if (authors.length <= 3) return authors.join(', ')

  const firstThree = authors.slice(0, 3).join(', ')
  const hasCjk = /[一-鿿]/.test(authors[0])
  return `${firstThree}, ${hasCjk ? '等' : 'et al.'}`
}

/** 按 GB/T 7714 格式输出参考文献条目 */
export function formatGB7714(ref: ReferenceItem): string {
  const authors = formatAuthors(ref.authors ?? [])
  const base = `${authors}. ${ref.title}`
  const doi = ref.doi ? ` DOI: ${ref.doi}.` : ''

  switch (ref.type) {
    case ReferenceType.JOURNAL: {
      const body = `${ref.journal ?? ''}, ${ref.year}, ${ref.volume ?? ''}${ref.issue ? `(${ref.issue})` : ''}${ref.pages ? `: ${ref.pages}` : ''}`
      return `${base}[J]. ${body}.${doi}`
    }

    case ReferenceType.BOOK: {
      const body = `${ref.address ? `${ref.address}: ` : ''}${ref.publisher ?? ''}, ${ref.year}`
      return `${base}[M]. ${body}.${doi}`
    }

    case ReferenceType.CONFERENCE:
      return `${base}[C]. ${ref.address ?? ''}, ${ref.year}${ref.pages ? `: ${ref.pages}` : ''}.${doi}`

    case ReferenceType.THESIS:
      return `${base}[D]. ${ref.address ?? ''}: ${ref.journal ?? ''}, ${ref.year}.${doi}`

    case ReferenceType.PATENT:
      return `${base}[P]. ${ref.address ?? ''}, ${ref.year}.${doi}`

    case ReferenceType.NEWSPAPER:
      return `${base}[N]. ${ref.journal ?? ''}, ${ref.year}${ref.pages ? `(${ref.pages})` : ''}.${doi}`

    case ReferenceType.ONLINE: {
      const body = `${ref.url ?? ''}, ${ref.year}${ref.accessDate ? `(${ref.accessDate})` : ''}`
      return `${base}[EB/OL]. ${body}.${doi}`
    }

    default:
      return `${base}.`
  }
}

/** 格式化整型引用列表 */
export function formatReferenceList(items: ReferenceItem[]): string[] {
  return items
    .sort((a, b) => a.index - b.index)
    .map((ref) => {
      if (ref.rawText) return `[${ref.index}] ${ref.rawText}`
      return `[${ref.index}] ${formatGB7714(ref as Required<Pick<ReferenceItem, 'type' | 'authors' | 'title' | 'year'>> & ReferenceItem)}`
    })
}
