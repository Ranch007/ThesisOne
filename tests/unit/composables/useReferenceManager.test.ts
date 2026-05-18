import { describe, it, expect } from 'vitest'
import { useReferenceManager } from '@/composables/useReferenceManager'
import { useReferencesStore } from '@/stores/references'
import { setActivePinia, createPinia } from 'pinia'

describe('useReferenceManager', () => {
  const pinia = createPinia()
  setActivePinia(pinia)

  beforeEach(() => {
    const s = useReferencesStore()
    s.items = []
  })

  it('should add a reference and auto-assign index', () => {
    const { add, items } = useReferenceManager()

    add('张三. 测试文章[J]. 测试期刊, 2024.')

    expect(items.value.length).toBe(1)
    expect(items.value[0].index).toBe(1)
    expect(items.value[0].rawText).toContain('张三')
  })

  it('should renumber after removing a reference', () => {
    const { add, remove, items } = useReferenceManager()

    add('A. First[J]. 刊, 2024.')
    add('B. Second[M]. 出版社, 2023.')

    expect(items.value.length).toBe(2)
    expect(items.value[0].index).toBe(1)
    expect(items.value[1].index).toBe(2)

    remove(items.value[0].id)
    expect(items.value.length).toBe(1)
    expect(items.value[0].index).toBe(1)
  })

  it('should update a reference field', () => {
    const { add, update, items } = useReferenceManager()

    add('张三. 原标题. 刊, 2024.')

    update(items.value[0].id, { rawText: '张三. 新标题. 刊, 2024.' })
    expect(items.value[0].rawText).toContain('新标题')
  })

  it('should count items correctly', () => {
    const { add, count } = useReferenceManager()

    add('A. T1[J]. 刊, 2024.')
    add('B. T2[M]. 出版社, 2023.')

    expect(count.value).toBe(2)
  })
})
