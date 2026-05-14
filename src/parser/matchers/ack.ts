import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配致谢标题 */
export function matchAckTitle(token: Token): DocumentNode | null {
  const text = token.text.trim()
  if (/^致\s*谢$/.test(text)) {
    return {
      id: uid(),
      type: NodeType.ACK_TITLE,
      text,
      lineNumber: token.lineNumber,
    }
  }
  return null
}

/** 收集致谢内容（跟随在致谢标题后的段落） */
export function collectAckContent(tokens: Token[], startIndex: number): DocumentNode[] {
  const nodes: DocumentNode[] = []
  for (let i = startIndex; i < tokens.length; i++) {
    if (tokens[i].isEmpty) continue
    const text = tokens[i].text.trim()
    // 遇到下一个章节标记则停止
    if (/^参考\s*文献$/.test(text) || /^附录/i.test(text)) break

    nodes.push({
      id: uid(),
      type: NodeType.ACK_CONTENT,
      text,
      lineNumber: tokens[i].lineNumber,
    })
  }
  return nodes
}
