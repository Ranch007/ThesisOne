import { NodeType } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { parseFormulaNumber } from '@/utils/figure-number'
import { uid } from '@/utils/uid'

/** 匹配公式：含括号编号如"（1-1）"（行中任意位置） */
export function matchFormula(token: Token, currentChapter: number): DocumentNode | null {
  const text = token.text.trim()
  const parsed = parseFormulaNumber(text)
  if (!parsed) return null

  // 排除图/表题（以"图"/"表"开头的行）
  if (/^[图表]/.test(text)) return null

  return {
    id: uid(),
    type: NodeType.FORMULA,
    text,
    lineNumber: token.lineNumber,
    chapterNumber: parsed.chapter || currentChapter,
    itemNumber: parsed.item,
  }
}
