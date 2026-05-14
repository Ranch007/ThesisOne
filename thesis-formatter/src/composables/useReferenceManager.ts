import { storeToRefs } from 'pinia'
import { useReferencesStore } from '@/stores/references'
import type { ReferenceItem } from '@/types/reference'

/**
 * 参考文献管理桥接
 *
 * 封装 referencesStore 的 CRUD 操作，
 * 为组件提供便捷的引用管理接口。
 */
export function useReferenceManager() {
  const refStore = useReferencesStore()
  const { items, count, byType } = storeToRefs(refStore)

  function add(item: Omit<ReferenceItem, 'id' | 'index'>) {
    refStore.addRef(item)
  }

  function remove(id: string) {
    refStore.removeRef(id)
  }

  function update(id: string, partial: Partial<ReferenceItem>) {
    refStore.updateRef(id, partial)
  }

  function reorder(fromIndex: number, toIndex: number) {
    refStore.moveRef(fromIndex, toIndex)
  }

  return { items, count, byType, add, remove, update, reorder }
}
