import { Discipline } from '@/types/ast'
import type { Token } from '@/types/ast'
import {
  SOCIAL_SCIENCE_RULES,
  SCIENCE_ENGINEERING_RULES,
} from '@/constants/jhu'

/**
 * 学科检测 —— 自动判断社科/理工标题体系
 *
 * 打分制：统计文本中社科/理工类标题特征的出现次数，
 * 仅当理工特征显著多于社科特征时切换为理工类，默认社科类。
 */
export function detectDiscipline(tokens: Token[]): Discipline {
  let socialScore = 0
  let scienceScore = 0

  for (const token of tokens) {
    if (token.isEmpty) continue
    const text = token.text.trim()

    if (SOCIAL_SCIENCE_RULES.heading1.test(text)) socialScore++
    if (SOCIAL_SCIENCE_RULES.heading2.test(text)) socialScore++
    if (SCIENCE_ENGINEERING_RULES.heading1.test(text)) scienceScore++
    if (SCIENCE_ENGINEERING_RULES.heading2.test(text)) scienceScore++
  }

  return scienceScore > socialScore * 2
    ? Discipline.SCIENCE_ENGINEERING
    : Discipline.SOCIAL_SCIENCE
}
