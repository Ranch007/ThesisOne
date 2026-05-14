import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 匹配署名信息：题目后含"学生"/"指导教师"关键词的行（搜索题目后 5 行内） */
export function matchAuthor(tokens: Token[], startIndex: number): DocumentNode | null {
  for (let i = startIndex; i < Math.min(startIndex + 5, tokens.length); i++) {
    const text = tokens[i].text.trim()
    if (tokens[i].isEmpty) continue
    if (/学生|指导教师/.test(text)) {
      return {
        id: uid(),
        type: NodeType.AUTHOR_INFO,
        text,
        lineNumber: tokens[i].lineNumber,
      }
    }
  }
  return null
}
