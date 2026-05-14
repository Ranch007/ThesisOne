import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { parseFigureNumber } from '@/utils/figure-number'
import { uid } from '@/utils/uid'

/** 匹配图题："图1-1" / "图 1-1" */
export function matchFigure(token: Token, currentChapter: number): DocumentNode | null {
  const text = token.text.trim()
  const parsed = parseFigureNumber(text)
  if (!parsed || !text.startsWith('图')) return null

  return {
    id: uid(),
    type: NodeType.FIGURE_CAPTION,
    text,
    lineNumber: token.lineNumber,
    chapterNumber: parsed.chapter || currentChapter,
    itemNumber: parsed.item,
  }
}
