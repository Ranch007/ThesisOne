import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配中文摘要 */
export function matchAbstractZh(tokens: Token[], startIndex: number): {
  nodes: DocumentNode[]
  nextIndex: number
} | null {
  const nodes: DocumentNode[] = []
  let i = startIndex

  // 查找 "摘要" 或 "中文摘要"
  while (i < tokens.length) {
    const text = tokens[i].text.trim()
    if (/^(中文摘要|摘要)$/.test(text)) {
      nodes.push({
        id: uid(),
        type: NodeType.ABSTRACT_ZH_TITLE,
        text,
        lineNumber: tokens[i].lineNumber,
      })
      i++
      break
    }
    i++
  }

  if (nodes.length === 0) return null

  // 收集摘要内容，直到关键词行
  while (i < tokens.length) {
    const text = tokens[i].text.trim()
    if (/^关键词[：:]/.test(text)) break
    if (tokens[i].isEmpty) {
      i++
      continue
    }
    nodes.push({
      id: uid(),
      type: NodeType.ABSTRACT_ZH_CONTENT,
      text,
      lineNumber: tokens[i].lineNumber,
    })
    i++
  }

  return { nodes, nextIndex: i }
}

/** 匹配英文摘要 */
export function matchAbstractEn(tokens: Token[], startIndex: number): {
  nodes: DocumentNode[]
  nextIndex: number
} | null {
  const nodes: DocumentNode[] = []
  let i = startIndex

  // 查找 "Abstract"
  while (i < tokens.length) {
    const text = tokens[i].text.trim()
    if (/^Abstract$/i.test(text)) {
      nodes.push({
        id: uid(),
        type: NodeType.ABSTRACT_EN_TITLE,
        text,
        lineNumber: tokens[i].lineNumber,
      })
      i++
      break
    }
    i++
  }

  if (nodes.length === 0) return null

  // 收集内容，直到 Keywords
  while (i < tokens.length) {
    const text = tokens[i].text.trim()
    if (/^Keywords[:;]/i.test(text)) break
    if (tokens[i].isEmpty) {
      i++
      continue
    }
    nodes.push({
      id: uid(),
      type: NodeType.ABSTRACT_EN_CONTENT,
      text,
      lineNumber: tokens[i].lineNumber,
    })
    i++
  }

  return { nodes, nextIndex: i }
}
