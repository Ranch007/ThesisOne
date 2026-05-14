import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配附录标题 */
export function matchAppendixTitle(token: Token): DocumentNode | null {
  const text = token.text.trim()
  if (/^附录[一二三四五六七八九十\d]/.test(text)) {
    return {
      id: uid(),
      type: NodeType.APPENDIX_TITLE,
      text,
      lineNumber: token.lineNumber,
    }
  }
  return null
}

/** 收集附录内容 */
export function collectAppendixContent(tokens: Token[], startIndex: number): DocumentNode[] {
  const nodes: DocumentNode[] = []
  for (let i = startIndex; i < tokens.length; i++) {
    if (tokens[i].isEmpty) continue
    const text = tokens[i].text.trim()
    if (/^附录[一二三四五六七八九十\d]/.test(text)) break

    nodes.push({
      id: uid(),
      type: NodeType.APPENDIX_CONTENT,
      text,
      lineNumber: tokens[i].lineNumber,
    })
  }
  return nodes
}
