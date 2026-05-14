import { describe, it, expect } from 'vitest'
import { tokenize } from '@/parser/tokenizer'
import { matchTitle } from '@/parser/matchers/title'
import {
  matchHeading1,
  matchHeading2,
  matchHeading3,
} from '@/parser/matchers/heading'
import { matchAuthor } from '@/parser/matchers/author'
import { matchFigure } from '@/parser/matchers/figure'
import { Discipline, NodeType } from '@/types/ast'
import type { Token } from '@/types/ast'

function tk(text: string): Token[] {
  return tokenize(text)
}

describe('matchTitle', () => {
  it('should match first non-empty line as title', () => {
    const tokens = tk('深度学习在NLP中的应用研究\n\n摘要')
    const result = matchTitle(tokens)
    expect(result).not.toBeNull()
    expect(result!.text).toBe('深度学习在NLP中的应用研究')
  })

  it('should return null for empty input', () => {
    expect(matchTitle([])).toBeNull()
  })
})

describe('matchAuthor', () => {
  it('should match line containing 学生 keyword', () => {
    const tokens = tk('论文题目\n学生：张三，计算机学院')
    const result = matchAuthor(tokens, 1)
    expect(result).not.toBeNull()
    expect(result!.text).toContain('学生')
  })
})

describe('matchHeading1 - 社科', () => {
  it('should match "一、绪论" as heading 1', () => {
    const tokens = tk('一、绪论')
    const result = matchHeading1(tokens[0], Discipline.SOCIAL_SCIENCE)
    expect(result).not.toBeNull()
    expect(result!.text).toBe('一、绪论')
    expect(result!.level).toBe(1)
  })

  it('should not match "1.1" as heading 1 in 社科 mode', () => {
    const tokens = tk('1.1 研究背景')
    const result = matchHeading1(tokens[0], Discipline.SOCIAL_SCIENCE)
    expect(result).toBeNull()
  })
})

describe('matchHeading1 - 理工', () => {
  it('should match "1 绪论" as heading 1', () => {
    const tokens = tk('1 绪论')
    const result = matchHeading1(tokens[0], Discipline.SCIENCE_ENGINEERING)
    expect(result).not.toBeNull()
    expect(result!.level).toBe(1)
  })
})

describe('matchHeading2 - 社科', () => {
  it('should match "（一）研究背景" as heading 2', () => {
    const tokens = tk('（一）研究背景')
    const result = matchHeading2(tokens[0], Discipline.SOCIAL_SCIENCE)
    expect(result).not.toBeNull()
    expect(result!.level).toBe(2)
  })
})

describe('matchHeading2 - 理工', () => {
  it('should match "1.1 研究背景" as heading 2', () => {
    const tokens = tk('1.1 研究背景')
    const result = matchHeading2(tokens[0], Discipline.SCIENCE_ENGINEERING)
    expect(result).not.toBeNull()
    expect(result!.level).toBe(2)
  })
})

describe('matchHeading3 - 社科', () => {
  it('should match "1. 数据来源" as heading 3', () => {
    const tokens = tk('1. 数据来源')
    const result = matchHeading3(tokens[0], Discipline.SOCIAL_SCIENCE)
    expect(result).not.toBeNull()
    expect(result!.level).toBe(3)
  })
})

describe('matchHeading3 - 理工', () => {
  it('should match "1.1.1 参数设置" as heading 3', () => {
    const tokens = tk('1.1.1 参数设置')
    const result = matchHeading3(tokens[0], Discipline.SCIENCE_ENGINEERING)
    expect(result).not.toBeNull()
    expect(result!.level).toBe(3)
  })
})

describe('matchFigure', () => {
  it('should match "图1-1 系统架构图"', () => {
    const tokens = tk('图1-1 系统架构图')
    const result = matchFigure(tokens[0], 1)
    expect(result).not.toBeNull()
    expect(result!.type).toBe(NodeType.FIGURE_CAPTION)
  })

  it('should match "图 2-3 实验结果"', () => {
    const tokens = tk('图 2-3 实验结果')
    const result = matchFigure(tokens[0], 2)
    expect(result).not.toBeNull()
  })
})

describe('matchFigure with table caption', () => {
  it('matchFigure only matches 图 prefix, not 表', () => {
    const tokens = tk('表2-1 样本基本信息')
    const result = matchFigure(tokens[0], 2)
    expect(result).toBeNull()
  })
})
