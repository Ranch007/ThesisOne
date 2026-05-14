import type { ReferenceItem } from '@/types/reference'

/**
 * 重排引擎
 *
 * 当参考文献增删后，重新分配序号 [1][2][3]...
 * 返回 oldIndex → newIndex 映射，用于同步正文中的引用。
 */

/** 全量重排，返回序号映射 */
export function renumber(items: ReferenceItem[]): Map<number, number> {
  const oldToNew = new Map<number, number>()

  items.forEach((item, i) => {
    const oldIndex = item.index
    const newIndex = i + 1
    oldToNew.set(oldIndex, newIndex)
    item.index = newIndex
  })

  return oldToNew
}

/** 删除后重排 */
export function renumberAfterRemove(items: ReferenceItem[]): Map<number, number> {
  return renumber(items)
}

export function renumberAfterInsert(items: ReferenceItem[]): Map<number, number> {
  return renumber(items)
}

export function renumberAfterMove(items: ReferenceItem[]): Map<number, number> {
  return renumber(items)
}
