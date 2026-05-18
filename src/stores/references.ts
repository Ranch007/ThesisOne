import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ReferenceItem } from '@/types/reference'
import { uid } from '@/utils/uid'

export const useReferencesStore = defineStore('references', () => {
  const items = ref<ReferenceItem[]>([])

  const count = computed(() => items.value.length)

  const byType = computed(() => {
    const grouped: Record<string, ReferenceItem[]> = {}
    for (const item of items.value) {
      const t = item.type ?? 'OTHER'
      ;(grouped[t] ??= []).push(item)
    }
    return grouped
  })

  function addRef(rawText: string) {
    items.value.push({
      id: uid(),
      index: items.value.length + 1,
      rawText: rawText.trim(),
    })
  }

  function removeRef(id: string) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx === -1) return
    items.value.splice(idx, 1)
    renumber()
  }

  function updateRef(id: string, partial: Partial<ReferenceItem>) {
    const item = items.value.find((i) => i.id === id)
    if (item) Object.assign(item, partial)
  }

  function moveRef(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= items.value.length) return
    if (toIndex < 0 || toIndex >= items.value.length) return
    const [item] = items.value.splice(fromIndex, 1)
    items.value.splice(toIndex, 0, item)
    renumber()
  }

  function renumber() {
    items.value.forEach((item, i) => {
      item.index = i + 1
    })
  }

  return { items, count, byType, addRef, removeRef, updateRef, moveRef, renumber }
})
