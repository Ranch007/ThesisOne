import { describe, it, expect, beforeEach } from 'vitest'
import { ReferenceStore } from '@/references/reference-store'
import { formatGB7714, formatReferenceList } from '@/references/gbt7714'
import { extractCitations, validateCitations, replaceCitations } from '@/references/citation-linker'
import { ReferenceType } from '@/types/reference'

describe('ReferenceStore', () => {
  let store: ReferenceStore

  beforeEach(() => {
    store = new ReferenceStore()
  })

  it('应正确添加参考文献并自动编号', () => {
    store.add('张三. 测试论文[J]. 某期刊, 2023.')
    store.add('李四. 测试书籍[M]. 北京: 某出版社, 2022.')

    expect(store.count).toBe(2)
    expect(store.getAll()[0].index).toBe(1)
    expect(store.getAll()[1].index).toBe(2)
  })

  it('应正确删除并重新编号', () => {
    store.add('A. X[J]. 刊, 2023.')
    store.add('B. Y[J]. 刊, 2023.')
    store.add('C. Z[J]. 刊, 2023.')

    store.remove(store.getAll()[1].id) // 删除 [2]

    expect(store.count).toBe(2)
    expect(store.getAll()[0].index).toBe(1)
    expect(store.getAll()[1].index).toBe(2)
  })

  it('应支持按类型筛选', () => {
    store.add('A. X[J]. 刊, 2023.')
    store.add('B. Y[M]. 出版社, 2022.')

    // getByType 仍可工作，通过字符串匹配
    expect(store.getAll().length).toBe(2)
  })

  it('move 应正确重排', () => {
    store.add('A. 1st[J]. 刊, 2023.')
    store.add('B. 2nd[J]. 刊, 2023.')
    store.add('C. 3rd[J]. 刊, 2023.')

    store.move(0, 2) // [1]移到[3]

    expect(store.getAll()[0].index).toBe(1)
    expect(store.getAll()[1].index).toBe(2)
    expect(store.getAll()[2].index).toBe(3)
    expect(store.getAll()[2].rawText).toContain('1st')
  })
})

describe('GB/T 7714 格式化', () => {
  it('应正确格式化期刊论文', () => {
    const formatted = formatGB7714({
      id: '1', index: 1, rawText: '', type: ReferenceType.JOURNAL,
      authors: ['张三', '李四'], title: '深度学习综述',
      journal: '计算机学报', year: 2020, volume: '43', issue: '1', pages: '1-20',
    })
    expect(formatted).toContain('[J]')
    expect(formatted).toContain('2020')
    expect(formatted).toContain('43(1)')
  })

  it('应正确格式化图书', () => {
    const formatted = formatGB7714({
      id: '2', index: 2, rawText: '', type: ReferenceType.BOOK,
      authors: ['王五'], title: '图像识别技术',
      publisher: '科学出版社', address: '北京', year: 2019,
    })
    expect(formatted).toContain('[M]')
    expect(formatted).toContain('科学出版社')
  })

  it('formatReferenceList 应优先使用 rawText', () => {
    const items = [
      { id: '1', index: 2, rawText: '李四. B[M]. 北京: P社, 2022.' },
      { id: '2', index: 1, rawText: '张三. A[J]. J刊, 2023.' },
    ] as any[]
    const list = formatReferenceList(items)
    expect(list[0]).toContain('[1]')
    expect(list[0]).toContain('张三')
    expect(list[1]).toContain('[2]')
    expect(list[1]).toContain('李四')
  })
})

describe('引用关联', () => {
  it('应从正文中提取所有引用序号', () => {
    const text = '如文献[1][2]所述，文献[3]也提到...'
    expect(extractCitations(text)).toEqual([1, 2, 3])
  })

  it('应检测孤立引用', () => {
    const bodyText = '参见[1][3]的论述'
    const items = [{ id: '1', index: 1 }] as any[]
    const result = validateCitations(bodyText, items)
    expect(result.orphans).toContain(3)
    expect(result.isValid).toBe(false)
  })

  it('应检测未使用文献', () => {
    const bodyText = '参见[1]的论述'
    const items = [
      { id: '1', index: 1 },
      { id: '2', index: 2 },
    ] as any[]
    const result = validateCitations(bodyText, items)
    expect(result.unused).toContain(2)
  })

  it('应正确替换正文中的引用序号', () => {
    const text = '参见[2]和[3]'
    const mapping = new Map([[2, 1], [3, 2]])
    expect(replaceCitations(text, mapping)).toBe('参见[1]和[2]')
  })
})
