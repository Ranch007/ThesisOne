import type { ThesisAST } from '@/types/ast'
import type { ReferenceItem, FormatIssue } from '@/types'
import { validateCitations } from '@/references'
import { uid } from '@/utils/uid'

/** 引用一致性检测 */
export function checkCitationConsistency(
  ast: ThesisAST,
  items: ReferenceItem[],
): FormatIssue[] {
  const issues: FormatIssue[] = []

  // 收集所有正文中的引用
  const bodyText = ast.body.map((n) => n.text).join('\n')
  const result = validateCitations(bodyText, items)

  if (result.orphans.length > 0) {
    for (const n of result.orphans) {
      issues.push({
        id: uid(),
        severity: 'error',
        type: 'citation_mismatch',
        message: `引用 [${n}] 在文献库中不存在`,
        location: { lineNumber: 0, nodeId: '' },
      })
    }
  }

  if (result.unused.length > 0) {
    for (const n of result.unused) {
      issues.push({
        id: uid(),
        severity: 'warning',
        type: 'citation_mismatch',
        message: `文献 [${n}] 未被正文引用`,
        location: { lineNumber: 0, nodeId: '' },
      })
    }
  }

  return issues
}
