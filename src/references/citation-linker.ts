import type { ReferenceItem, CitationValidation } from '@/types/reference'

/** 从正文中提取所有引用序号 */
export function extractCitations(bodyText: string): number[] {
  const matches = bodyText.matchAll(/\[(\d+)\]/g)
  return [...matches].map((m) => parseInt(m[1]))
}

/** 验证引用一致性 */
export function validateCitations(
  bodyText: string,
  items: ReferenceItem[],
): CitationValidation {
  const cited = extractCitations(bodyText)
  const available = new Set(items.map((i) => i.index))
  const orphans = cited.filter((n) => !available.has(n))
  const unused = [...available].filter((n) => !cited.includes(n))

  return {
    orphans,
    unused,
    isValid: orphans.length === 0 && unused.length === 0,
  }
}

/** 替换正文中的引用序号（重排后同步） */
export function replaceCitations(
  bodyText: string,
  mapping: Map<number, number>,
): string {
  return bodyText.replace(/\[(\d+)\]/g, (_match, n) => {
    const oldIdx = parseInt(n)
    const newIdx = mapping.get(oldIdx)
    return newIdx !== undefined ? `[${newIdx}]` : `[${oldIdx}]`
  })
}
