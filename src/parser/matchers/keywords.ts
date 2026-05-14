import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配中文关键词 */
export function matchKeywordsZh(tokens: Token[], startIndex: number): DocumentNode | null {
  for (let i = startIndex; i < Math.min(startIndex + 3, tokens.length); i++) {
    const text = tokens[i].text.trim()
    if (/^关键词[：:]/.test(text)) {
      return {
        id: uid(),
        type: NodeType.KEYWORDS_ZH,
        text,
        lineNumber: tokens[i].lineNumber,
      }
    }
  }
  return null
}

/** 匹配英文关键词 */
export function matchKeywordsEn(tokens: Token[], startIndex: number): DocumentNode | null {
  for (let i = startIndex; i < Math.min(startIndex + 3, tokens.length); i++) {
    const text = tokens[i].text.trim()
    if (/^Keywords[:;]/i.test(text)) {
      return {
        id: uid(),
        type: NodeType.KEYWORDS_EN,
        text,
        lineNumber: tokens[i].lineNumber,
      }
    }
  }
  return null
}
