import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFormatValidator } from '@/composables/useFormatValidator'
import { useDocumentStore } from '@/stores/document'
import { useReferencesStore } from '@/stores/references'
import { NodeType, Discipline } from '@/types/ast'
import type { ThesisAST } from '@/types/ast'

describe('useFormatValidator', () => {
  const pinia = createPinia()
  setActivePinia(pinia)

  beforeEach(() => {
    const ds = useDocumentStore()
    ds.clearAll()
    const rs = useReferencesStore()
    rs.items = []
  })

  function setAST(ast: ThesisAST) {
    const ds = useDocumentStore()
    ds.setAST(ast)
  }

  it('should detect heading level skip', () => {
    setAST({
      frontMatter: {
        title: null,
        authorInfo: null,
        abstractZh: [],
        abstractEn: [],
        toc: [],
      },
      body: [
        {
          id: '1',
          type: NodeType.HEADING_1,
          text: '一、绪论',
          lineNumber: 1,
          level: 1,
        },
        {
          id: '2',
          type: NodeType.HEADING_3,
          text: '1. 背景',
          lineNumber: 2,
          level: 3,
        },
      ],
      backMatter: {
        references: [],
        acknowledgement: [],
        appendices: [],
      },
    })

    const { runValidation } = useFormatValidator()
    const issues = runValidation()

    expect(issues.some((i) => i.type === 'heading_skip')).toBe(true)
  })

  it('should return empty for clean AST', () => {
    setAST({
      frontMatter: {
        title: null,
        authorInfo: null,
        abstractZh: [],
        abstractEn: [],
        toc: [],
      },
      body: [
        {
          id: '1',
          type: NodeType.PARAGRAPH,
          text: '一段正文[1][2][3][4][5][6][7][8][9][10][11][12][13][14][15]',
          lineNumber: 1,
        },
      ],
      backMatter: {
        references: [],
        acknowledgement: [],
        appendices: [],
      },
    })

    // 添加足够参考文献以通过数量合规检测（≥15 篇，≥3 篇英文）
    const rs = useReferencesStore()
    for (let i = 1; i <= 12; i++) {
      rs.items.push({ id: `cn${i}`, index: i, authors: ['张三'], title: `文献${i}`, year: 2020 } as any)
    }
    for (let i = 13; i <= 15; i++) {
      rs.items.push({ id: `en${i}`, index: i, authors: ['Smith'], title: `Paper${i}`, year: 2020 } as any)
    }

    const { runValidation } = useFormatValidator()
    const issues = runValidation()

    expect(issues).toEqual([])
  })

  it('should return empty when AST is null', () => {
    const ds = useDocumentStore()
    ds.ast = null

    const { runValidation } = useFormatValidator()
    const issues = runValidation()

    expect(issues).toEqual([])
  })
})
