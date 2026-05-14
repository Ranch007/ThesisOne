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
    text: m[2],
    lineNumber: token.lineNumber,
    level,
  }
}
