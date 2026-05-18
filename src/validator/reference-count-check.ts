import type { ReferenceItem, FormatIssue } from '@/types'
import { uid } from '@/utils/uid'

/** 参考文献数量合规检测：总量、英文比例 */
export function checkReferenceCount(items: ReferenceItem[]): FormatIssue[] {
  const issues: FormatIssue[] = []

  if (items.length === 0) {
    issues.push({
      id: uid(),
      severity: 'error',
      type: 'reference_count',
      message: '未添加参考文献（江汉大学要求 ≥15 篇）',
      location: { lineNumber: 0, nodeId: '' },
    })
  } else if (items.length < 15) {
    issues.push({
      id: uid(),
      severity: 'warning',
      type: 'reference_count',
      message: `参考文献仅 ${items.length} 篇（江汉大学要求 ≥15 篇）`,
      location: { lineNumber: 0, nodeId: '' },
    })
  }

  const enCount = items.filter((r) =>
    /^[A-Za-z]/.test(r.authors?.[0] ?? ''),
  ).length
  if (items.length > 0 && enCount < 3) {
    issues.push({
      id: uid(),
      severity: 'warning',
      type: 'reference_count',
      message: `英文文献仅 ${enCount} 篇（江汉大学要求 ≥3 篇）`,
      location: { lineNumber: 0, nodeId: '' },
    })
  }

  return issues
}
