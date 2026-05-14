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
          text: '一段正文',
          lineNumber: 1,
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
