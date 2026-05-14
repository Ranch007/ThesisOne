import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配目录标题 */
export function matchTOC(token: Token): DocumentNode | null {
  const text = token.text.trim()
  if (/^目\s*录$/.test(text)) {
    return {
      id: uid(),
      type: NodeType.TOC_TITLE,
      text,
      lineNumber: token.lineNumber,
    }
  }
  return null
}
