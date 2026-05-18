import { describe, it, expect } from 'vitest'
import { buildTOC } from '@/exporter/toc-builder'
import { DEFAULT_CONFIG } from '@/constants/defaults'
import { NodeType } from '@/types/ast'
import type { DocumentNode } from '@/types/ast'

describe('buildTOC', () => {
  it('should return Paragraphs for heading nodes with abstracts', () => {
    const headings: DocumentNode[] = [
      {
        id: '1',
        type: NodeType.HEADING_1,
        text: '一、绪论',
        lineNumber: 10,
        level: 1,
      },
      {
        id: '2',
        type: NodeType.HEADING_2,
        text: '（一）研究背景',
        lineNumber: 15,
        level: 2,
      },
    ]
    // 含中英文摘要 → 2 摘要条目 + 2 标题条目 = 4
    const result = buildTOC(headings, DEFAULT_CONFIG, true, true)
    expect(result.length).toBe(4)
  })

  it('should skip abstract entries when no abstracts', () => {
    const result = buildTOC([], DEFAULT_CONFIG, false, false)
    expect(result.length).toBe(0)
  })

  it('should include only Chinese abstract when English abstract is empty', () => {
    const result = buildTOC([], DEFAULT_CONFIG, true, false)
    expect(result.length).toBe(1) // 仅中文摘要
  })

  it('should include back section titles', () => {
    const result = buildTOC([], DEFAULT_CONFIG, false, false, ['参考文献', '致谢', '附录'])
    expect(result.length).toBe(3)
  })
})
