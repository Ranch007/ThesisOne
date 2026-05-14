import type { ReferenceItem, ReferenceType } from '@/types/reference'
import { uid } from '@/utils/uid'
import { renumber } from './renumber'

/**
 * 参考文献库管理
 *
 * 纯逻辑层，不依赖 Pinia/Vue。由 Store 或 Composable 调用。
 */
export class ReferenceStore {
  private items: ReferenceItem[] = []

  getAll(): ReferenceItem[] {
    return this.items
  }

  getById(id: string): ReferenceItem | undefined {
    return this.items.find((i) => i.id === id)
  }

  getByType(type: ReferenceType): ReferenceItem[] {
    return this.items.filter((i) => i.type === type)
  }

  get count(): number {
    return this.items.length
  }

  add(item: Omit<ReferenceItem, 'id' | 'index'>): ReferenceItem {
    const newItem: ReferenceItem = {
      ...item,
      id: uid(),
      index: this.items.length + 1,
    }
    this.items.push(newItem)
    return newItem
  }

  remove(id: string): ReferenceItem | undefined {
    const idx = this.items.findIndex((i) => i.id === id)
    if (idx === -1) return undefined
    const [removed] = this.items.splice(idx, 1)
    renumber(this.items)
    return removed
  }

  update(id: string, partial: Partial<ReferenceItem>): boolean {
    const item = this.items.find((i) => i.id === id)
    if (!item) return false
    Object.assign(item, partial)
    return true
  }

  move(fromIndex: number, toIndex: number): boolean {
    if (fromIndex < 0 || fromIndex >= this.items.length) return false
    if (toIndex < 0 || toIndex >= this.items.length) return false
    const [item] = this.items.splice(fromIndex, 1)
    this.items.splice(toIndex, 0, item)
    renumber(this.items)
    return true
  }
}
