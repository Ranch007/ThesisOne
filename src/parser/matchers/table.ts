import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { parseFigureNumber } from '@/utils/figure-number'
import { uid } from '@/utils/uid'

/** 匹配表题："表1-1" / "表 1-1" */
export function matchTable(token: Token, currentChapter: number): DocumentNode | null {
  const text = token.text.trim()
  const parsed = parseFigureNumber(text)
  if (!parsed || !text.startsWith('表')) return null

  return {
    id: uid(),
    type: NodeType.TABLE_CAPTION,
    text,
    lineNumber: token.lineNumber,
    chapterNumber: parsed.chapter || currentChapter,
    itemNumber: parsed.item,
  }
}
