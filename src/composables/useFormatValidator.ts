import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useValidationStore } from '@/stores/validation'
import { uid } from '@/utils/uid'
import type { FormatIssue } from '@/types/validation'
import type { DocumentNode } from '@/types/ast'
import { NodeType } from '@/types/ast'

/** 格式检测桥接 */
export function useFormatValidator() {
  const docStore = useDocumentStore()
  const valStore = useValidationStore()
  const { ast } = storeToRefs(docStore)

  function runValidation(): FormatIssue[] {
    if (!ast.value) {
      valStore.clearIssues()
      return []
    }

    const issues: FormatIssue[] = []

    issues.push(...checkHeadingHierarchy(ast.value.body))
    issues.push(...checkFigureTableSequence(ast.value.body))
    issues.push(...checkCitationConsistency())

    valStore.setIssues(issues)
    return issues
  }

  return { runValidation, ...storeToRefs(valStore) }
}

function checkHeadingHierarchy(body: DocumentNode[]): FormatIssue[] {
  const issues: FormatIssue[] = []
  let prevLevel = 0

  for (const node of body) {
    if (node.level) {
      if (node.level > prevLevel + 1) {
        issues.push({
          id: uid(),
          severity: 'error',
          type: 'heading_skip',
          message: `标题层级跳跃: L${prevLevel} → L${node.level}（跳过了 L${prevLevel + 1}）`,
          location: { lineNumber: node.lineNumber, nodeId: node.id },
        })
      }
      prevLevel = node.level
    }
  }

  return issues
}

function checkFigureTableSequence(body: DocumentNode[]): FormatIssue[] {
  const issues: FormatIssue[] = []
  let lastFigureNum = 0
  let lastTableNum = 0
  let currentChapter = 0

  for (const node of body) {
    if (node.type === NodeType.HEADING_1) {
      const m = node.text.match(/^(\d+)/)
      currentChapter = m ? parseInt(m[1]) : currentChapter
      lastFigureNum = 0
      lastTableNum = 0
    }

    if (node.type === NodeType.FIGURE_CAPTION && node.chapterNumber === currentChapter) {
      const n = node.itemNumber ?? lastFigureNum + 1
      if (n !== lastFigureNum + 1) {
        issues.push({
          id: uid(),
          severity: 'warning',
          type: 'figure_gap',
          message: `图编号不连续: 期望 图${currentChapter}-${lastFigureNum + 1}`,
          location: { lineNumber: node.lineNumber, nodeId: node.id },
        })
      }
      lastFigureNum = n
    }

    if (node.type === NodeType.TABLE_CAPTION && node.chapterNumber === currentChapter) {
      const n = node.itemNumber ?? lastTableNum + 1
      if (n !== lastTableNum + 1) {
        issues.push({
          id: uid(),
          severity: 'warning',
          type: 'figure_gap',
          message: `表编号不连续: 期望 表${currentChapter}-${lastTableNum + 1}`,
          location: { lineNumber: node.lineNumber, nodeId: node.id },
        })
      }
      lastTableNum = n
    }
  }

  return issues
}

function checkCitationConsistency(): FormatIssue[] {
  // 完整实现将扫描 body 文本提取 [\d+] 引用，
  // 交叉比对 references store 中的条目。
  return []
}
