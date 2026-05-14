import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配论文题目：全文第一个非空行 */
export function matchTitle(tokens: Token[]): DocumentNode | null {
  for (const token of tokens) {
    if (!token.isEmpty) {
      return {
        id: uid(),
        type: NodeType.THESIS_TITLE,
        text: token.text.trim(),
        lineNumber: token.lineNumber,
      }
    }
  }
  return null
}
