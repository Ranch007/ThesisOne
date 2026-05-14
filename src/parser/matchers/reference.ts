import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配参考文献标题 */
export function matchRefTitle(token: Token): DocumentNode | null {
  const text = token.text.trim()
  if (/^参考\s*文献$/.test(text)) {
    return {
      id: uid(),
      type: NodeType.REF_TITLE,
      text,
      lineNumber: token.lineNumber,
    }
  }
  return null
}

/** 匹配参考文献条目：[1] / [2] 开头 */
export function matchRefItem(token: Token): DocumentNode | null {
  const text = token.text.trim()
  if (/^\[\d+\]/.test(text)) {
    return {
      id: uid(),
      type: NodeType.REF_ITEM,
      text,
      lineNumber: token.lineNumber,
    }
  }
  return null
}
