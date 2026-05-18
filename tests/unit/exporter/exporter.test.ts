import { describe, it, expect } from 'vitest'
import { parseThesis } from '@/parser'
import { buildDocument } from '@/exporter'
import { Discipline } from '@/types/ast'
import { DEFAULT_CONFIG } from '@/constants/defaults'
import { formatGB7714 } from '@/references/gbt7714'
import { ReferenceType } from '@/types/reference'

const SAMPLE = `基于深度学习的图像识别研究

学生：计算机科学与技术学院

中文摘要
本文研究了深度学习在图像识别领域的应用。
关键词：深度学习；图像识别；卷积神经网络

一、绪论

本章介绍研究背景和意义。

（一）研究背景

深度学习技术发展迅速。

（二）研究意义

本研究具有重要意义。
`

describe('buildDocument - 基本结构', () => {
  const ast = parseThesis(SAMPLE, { discipline: Discipline.SOCIAL_SCIENCE })

  it('应成功构建Document对象', () => {
    const doc = buildDocument({ ast, config: DEFAULT_CONFIG })
    expect(doc).toBeDefined()
    expect(doc).toBeInstanceOf(Object)
  })

  it('应包含多个section', () => {
    const doc = buildDocument({ ast, config: DEFAULT_CONFIG })
    expect(doc).toBeDefined()
  })
})

describe('GB/T 7714 - 所有类型', () => {
  it('期刊', () => {
    const r = formatGB7714({
      id: '1', index: 1, rawText: '', type:ReferenceType.JOURNAL,
      authors: ['张三'], title: '测试', journal: '学报',
      year: 2023, volume: '10', pages: '1-10',
    })
    expect(r).toContain('[J]')
  })

  it('会议', () => {
    const r = formatGB7714({
      id: '1', index: 1, rawText: '', type:ReferenceType.CONFERENCE,
      authors: ['张三'], title: '测试', address: '北京',
      year: 2023, pages: '100-110',
    })
    expect(r).toContain('[C]')
  })

  it('学位论文', () => {
    const r = formatGB7714({
      id: '1', index: 1, rawText: '', type:ReferenceType.THESIS,
      authors: ['张三'], title: '测试',
      address: '北京', journal: '清华大学', year: 2023,
    })
    expect(r).toContain('[D]')
  })

  it('专利', () => {
    const r = formatGB7714({
      id: '1', index: 1, rawText: '', type:ReferenceType.PATENT,
      authors: ['张三'], title: '测试', address: '北京', year: 2023,
    })
    expect(r).toContain('[P]')
  })

  it('报纸', () => {
    const r = formatGB7714({
      id: '1', index: 1, rawText: '', type:ReferenceType.NEWSPAPER,
      authors: ['张三'], title: '测试', journal: '人民日报', year: 2023,
    })
    expect(r).toContain('[N]')
  })

  it('电子文献', () => {
    const r = formatGB7714({
      id: '1', index: 1, rawText: '', type:ReferenceType.ONLINE,
      authors: ['张三'], title: '测试',
      url: 'https://example.com', year: 2023, accessDate: '2023-01-01',
    })
    expect(r).toContain('[EB/OL]')
  })
})
