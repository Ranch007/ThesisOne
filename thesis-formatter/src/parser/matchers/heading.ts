import { NodeType, Discipline } from '@/types/ast'
import type { DocumentNode, Token } from '@/types/ast'
import { SOCIAL_SCIENCE_RULES, SCIENCE_ENGINEERING_RULES } from '@/constants/jhu'
import { uid } from '@/utils/uid'

/** 匹配一级标题 */
export function matchHeading1(token: Token, discipline: Discipline): DocumentNode | null {
  const text = token.text.trim()
  const rule = discipline === Discipline.SOCIAL_SCIENCE
    ? SOCIAL_SCIENCE_RULES.heading1
    : SCIENCE_ENGINEERING_RULES.heading1

  if (rule.test(text)) {
    return {
      id: uid(),
      type: NodeType.HEADING_1,
      text,
      lineNumber: token.lineNumber,
      level: 1,
    }
  }
  return null
}

/** 匹配二级标题 */
export function matchHeading2(token: Token, discipline: Discipline): DocumentNode | null {
  const text = token.text.trim()
  const rule = discipline === Discipline.SOCIAL_SCIENCE
    ? SOCIAL_SCIENCE_RULES.heading2
    : SCIENCE_ENGINEERING_RULES.heading2

  if (rule.test(text)) {
    return {
      id: uid(),
      type: NodeType.HEADING_2,
      text,
      lineNumber: token.lineNumber,
      level: 2,
    }
  }
  return null
}

/** 匹配三级标题 */
export function matchHeading3(token: Token, discipline: Discipline): DocumentNode | null {
  const text = token.text.trim()
  const rule = discipline === Discipline.SOCIAL_SCIENCE
    ? SOCIAL_SCIENCE_RULES.heading3
    : SCIENCE_ENGINEERING_RULES.heading3

  if (rule.test(text)) {
    return {
      id: uid(),
      type: NodeType.HEADING_3,
      text,
      lineNumber: token.lineNumber,
      level: 3,
    }
  }
  return null
}
