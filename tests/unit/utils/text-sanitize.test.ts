import { describe, it, expect } from 'vitest'
import { sanitizeText, mergeBlankLines, cleanExtraSpaces } from '@/utils/text-sanitize'
import { normalizePunctuation } from '@/utils/punctuation'
import { parseFigureNumber, parseFormulaNumber } from '@/utils/figure-number'
import { cmToTwip, ptToHalfPoint, cmToPx } from '@/constants/units'

describe('sanitizeText', () => {
  it('应合并多个连续空行为单个', () => {
    expect(mergeBlankLines('a\n\n\n\nb')).toBe('a\n\nb')
  })

  it('不应合并少于3个的空行', () => {
    expect(mergeBlankLines('a\n\nb')).toBe('a\n\nb')
  })

  it('应去除首尾空白行', () => {
    const result = sanitizeText('\n\nhello\n\n')
    expect(result).toBe('hello')
  })

  it('应清理行内多余空格', () => {
    expect(cleanExtraSpaces('hello    world')).toBe('hello world')
  })
})

describe('normalizePunctuation', () => {
  it('应将中文语境下的半角逗号转全角', () => {
    expect(normalizePunctuation('深度学习,机器学习')).toBe('深度学习，机器学习')
  })

  it('应将半角括号转全角', () => {
    expect(normalizePunctuation('本文研究了(CNN)模型')).toBe('本文研究了（CNN）模型')
  })

  it('不应转换纯英文行', () => {
    expect(normalizePunctuation('Machine Learning, Deep Learning')).toBe(
      'Machine Learning, Deep Learning',
    )
  })
})

describe('figure-number', () => {
  it('应解析图编号', () => {
    expect(parseFigureNumber('图1-1 结果示意图')).toEqual({
      chapter: 1,
      item: 1,
    })
  })

  it('应解析带空格的图编号', () => {
    expect(parseFigureNumber('图 2-3 性能对比')).toEqual({
      chapter: 2,
      item: 3,
    })
  })

  it('应解析公式编号', () => {
    expect(parseFormulaNumber('E=mc²（1-1）')).toEqual({
      chapter: 1,
      item: 1,
    })
  })

  it('非图题应返回null', () => {
    expect(parseFigureNumber('这是普通文本')).toBeNull()
  })
})

describe('单位转换', () => {
  it('cmToTwip 应正确转换', () => {
    expect(Math.abs(cmToTwip(2.54) - 1440)).toBeLessThan(2) // 1 inch ≈ 1440 twip
  })

  it('ptToHalfPoint 应正确转换', () => {
    expect(ptToHalfPoint(18)).toBe(36) // 18pt = 36 half-point (小2号)
    expect(ptToHalfPoint(12)).toBe(24) // 12pt = 24 half-point (小4号)
  })

  it('cmToPx 应正确转换', () => {
    expect(Math.abs(cmToPx(21) - 794)).toBeLessThan(1) // A4 width
    expect(Math.abs(cmToPx(29.7) - 1123)).toBeLessThan(1) // A4 height
  })
})
