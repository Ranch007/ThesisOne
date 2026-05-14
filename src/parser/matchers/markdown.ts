import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 解析 Markdown 标题层级（# → H1, ## → H2, ### → H3） */
export function matchMarkdownHeading(token: Token): DocumentNode | null {
  const text = token.text.trim()
  const m = text.match(/^(#{1,3})\s+(.+)/)
  if (!m) return null

  const level = m[1].length as 1 | 2 | 3
  const typeMap = {
    1: NodeType.HEADING_1,
    2: NodeType.HEADING_2,
    3: NodeType.HEADING_3,
  }

  return {
    id: uid(),
    type: typeMap[level],
    text: stripMarkdownInline(m[2]),
    lineNumber: token.lineNumber,
    level,
  }
}

/** 清除 Markdown 行内格式：加粗、斜体、删除线、代码 */
export function stripMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`(.+?)`/g, '$1')
}

