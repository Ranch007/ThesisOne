import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'

/** 自动保存：500ms 防抖同步文本到 localStorage */
export function useAutoSave() {
  const docStore = useDocumentStore()
  const { rawText } = storeToRefs(docStore)

  let timer: ReturnType<typeof setTimeout>

  watch(rawText, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        localStorage.setItem('thesis:autosave', val)
      } catch { /* 静默 */ }
    }, 500)
  })

  function restoreAutoSave(): string | null {
    try {
      return localStorage.getItem('thesis:autosave')
    } catch {
      return null
    }
  }

  return { restoreAutoSave }
}
