import type { ThesisAST } from '@/types/ast'
import type { FormatIssue } from '@/types/validation'
import { uid } from '@/utils/uid'

/** 字体规范性检测：检查西文/数字是否混入中文字体 */
export function checkFontCompliance(ast: ThesisAST): FormatIssue[] {
  const issues: FormatIssue[] = []

  for (const node of ast.body) {
    const text = node.text
    // 检测西文字符紧跟中文字符（或反之）但没有字体切换标记
    const mixed = /[一-鿿][a-zA-Z]{2,}|[a-zA-Z]{2,}[一-鿿]/.test(text)
    if (mixed) {
      issues.push({
        id: uid(),
        severity: 'warning',
        type: 'font_mismatch',
        message: `中英文混排可能未设置西文字体: "${text.slice(0, 40)}..."`,
        location: { lineNumber: node.lineNumber, nodeId: node.id },
      })
    }
  }

  return issues
}
