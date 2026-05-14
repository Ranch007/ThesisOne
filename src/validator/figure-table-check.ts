import type { DocumentNode } from '@/types/ast'
import type { FormatIssue } from '@/types/validation'
import { NodeType } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 图表编号连续性检测 */
export function checkFigureTableSequence(body: DocumentNode[]): FormatIssue[] {
  const issues: FormatIssue[] = []
  let lastFigureNum = 0
  let lastTableNum = 0
  let currentChapter = 0

  for (const node of body) {
    if (node.type === NodeType.HEADING_1) {
      const m = node.text.match(/^(?:[一二三四五六七八九十]+|\d+)/)
      if (m) {
        currentChapter = chineseToNumber(m[0]) || parseInt(m[0]) || currentChapter
      }
      lastFigureNum = 0
      lastTableNum = 0
    }

    if (node.type === NodeType.FIGURE_CAPTION) {
      if (node.itemNumber && node.itemNumber !== lastFigureNum + 1) {
        issues.push({
          id: uid(),
          severity: 'warning',
          type: 'figure_gap',
          message: `图编号不连续: 期望 图${currentChapter}-${lastFigureNum + 1}，实际 ${node.text}`,
          location: { lineNumber: node.lineNumber, nodeId: node.id },
        })
      }
      lastFigureNum = node.itemNumber ?? lastFigureNum + 1
    }

    if (node.type === NodeType.TABLE_CAPTION) {
      if (node.itemNumber && node.itemNumber !== lastTableNum + 1) {
        issues.push({
          id: uid(),
          severity: 'warning',
          type: 'figure_gap',
          message: `表编号不连续: 期望 表${currentChapter}-${lastTableNum + 1}，实际 ${node.text}`,
          location: { lineNumber: node.lineNumber, nodeId: node.id },
        })
      }
      lastTableNum = node.itemNumber ?? lastTableNum + 1
    }
  }

  return issues
}

function chineseToNumber(ch: string): number {
  const map: Record<string, number> = {
    一: 1, 二: 2, 三: 3, 四: 4, 五: 5,
    六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
  }
  return map[ch] ?? 0
}
