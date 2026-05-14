import { describe, it, expect } from 'vitest'
import { useReferenceManager } from '@/composables/useReferenceManager'
import { useReferencesStore } from '@/stores/references'
import { ReferenceType } from '@/types/reference'
import { setActivePinia, createPinia } from 'pinia'

describe('useReferenceManager', () => {
  const pinia = createPinia()
  setActivePinia(pinia)

  beforeEach(() => {
    // 清空 store
    const s = useReferencesStore()
    s.items = []
  })

  it('should add a reference and auto-assign index', () => {
    const { add, items } = useReferenceManager()

    add({
      type: ReferenceType.JOURNAL,
      authors: ['张三'],
      title: '测试文章',
      year: 2024,
      journal: '测试期刊',
    })

    expect(items.value.length).toBe(1)
    expect(items.value[0].index).toBe(1)
    expect(items.value[0].title).toBe('测试文章')
  })

  it('should renumber after removing a reference', () => {
    const { add, remove, items } = useReferenceManager()

    add({
      type: ReferenceType.JOURNAL,
      authors: ['A'],
      title: 'First',
      year: 2024,
    })
    add({
      type: ReferenceType.BOOK,
      authors: ['B'],
      title: 'Second',
      year: 2023,
    })

    expect(items.value.length).toBe(2)
    expect(items.value[0].index).toBe(1)
    expect(items.value[1].index).toBe(2)

    remove(items.value[0].id)
    expect(items.value.length).toBe(1)
    expect(items.value[0].index).toBe(1)
  })

  it('should update a reference field', () => {
    const { add, update, items } = useReferenceManager()

    add({
      type: ReferenceType.JOURNAL,
      authors: ['张三'],
      title: '原标题',
      year: 2024,
    })

    update(items.value[0].id, { title: '新标题' })
    expect(items.value[0].title).toBe('新标题')
  })

  it('should count items correctly', () => {
    const { add, count } = useReferenceManager()

    add({
      type: ReferenceType.JOURNAL,
      authors: ['A'],
      title: 'T1',
      year: 2024,
    })
    add({
      type: ReferenceType.BOOK,
      authors: ['B'],
      title: 'T2',
      year: 2023,
    })

    expect(count.value).toBe(2)
  })
})
