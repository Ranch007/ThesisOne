import type { ThesisAST } from '@/types/ast'
import type { FormatIssue } from '@/types/validation'
import { NodeType } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 标题层级连贯性检测 */
export function checkHeadingHierarchy(ast: ThesisAST): FormatIssue[] {
  const issues: FormatIssue[] = []
  let prevLevel = 0

  for (const node of ast.body) {
    if (node.level) {
      if (node.level > prevLevel + 1) {
        issues.push({
          id: uid(),
          severity: 'error',
          type: 'heading_skip',
          message: `标题层级跳跃: L${prevLevel} → L${node.level}`,
          location: { lineNumber: node.lineNumber, nodeId: node.id },
        })
      }
      prevLevel = node.level
    }
  }

  const h2Nodes = ast.body.filter((n) => n.type === NodeType.HEADING_2)
  const h3Nodes = ast.body.filter((n) => n.type === NodeType.HEADING_3)

  if (h3Nodes.length > 0 && h2Nodes.length === 0) {
    issues.push({
      id: uid(),
      severity: 'warning',
      type: 'heading_skip',
      message: '存在三级标题但没有二级标题',
      location: { lineNumber: h3Nodes[0].lineNumber, nodeId: h3Nodes[0].id },
    })
  }

  return issues
}
