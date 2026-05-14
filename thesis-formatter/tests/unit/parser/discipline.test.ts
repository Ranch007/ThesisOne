import { describe, it, expect } from 'vitest'
import { detectDiscipline } from '@/parser/discipline'
import { tokenize } from '@/parser/tokenizer'
import { Discipline } from '@/types/ast'

describe('detectDiscipline - 社科类', () => {
  it('应识别中文数字+顿号标题为社科', () => {
    const text = '一、绪论\n\n正文内容\n\n二、理论基础\n'
    const result = detectDiscipline(tokenize(text))
    expect(result).toBe(Discipline.SOCIAL_SCIENCE)
  })

  it('应识别全角括号标题为社科', () => {
    const text = '（一）研究背景\n\n正文内容\n\n（二）研究意义\n'
    const result = detectDiscipline(tokenize(text))
    expect(result).toBe(Discipline.SOCIAL_SCIENCE)
  })
})

describe('detectDiscipline - 理工类', () => {
  it('应识别纯数字+空格标题为理工', () => {
    const text = '1 绪论\n\n正文\n\n2 理论基础\n\n3 实验\n\n4 结论\n'
    const result = detectDiscipline(tokenize(text))
    expect(result).toBe(Discipline.SCIENCE_ENGINEERING)
  })

  it('在社科特征多于理工时仍为社科', () => {
    const text = '一、绪论\n二、方法\n\n1 步骤一\n2 步骤二\n'
    // 社科2分，理工2分 → 不满足 scienceScore > socialScore*2
    const result = detectDiscipline(tokenize(text))
    expect(result).toBe(Discipline.SOCIAL_SCIENCE)
  })

  it('空文本默认为社科', () => {
    expect(detectDiscipline(tokenize(''))).toBe(Discipline.SOCIAL_SCIENCE)
  })
})
