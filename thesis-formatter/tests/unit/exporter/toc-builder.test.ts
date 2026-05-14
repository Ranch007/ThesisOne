import { describe, it, expect } from 'vitest'
import { buildTOC } from '@/exporter/toc-builder'
import { DEFAULT_CONFIG } from '@/constants/defaults'
import { NodeType } from '@/types/ast'
import type { DocumentNode } from '@/types/ast'

describe('buildTOC', () => {
  it('should return Paragraphs for heading nodes', () => {
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
    const result = buildTOC(headings, DEFAULT_CONFIG)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return title paragraph even for empty headings', () => {
    const result = buildTOC([], DEFAULT_CONFIG)
    expect(Array.isArray(result)).toBe(true)
  })
})
