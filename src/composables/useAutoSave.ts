import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useToast } from '@/composables/useToast'

/** 自动保存：500ms 防抖同步文本到 localStorage */
export function useAutoSave() {
  const docStore = useDocumentStore()
  const { rawText } = storeToRefs(docStore)
  const toast = useToast()

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
      const saved = localStorage.getItem('thesis:autosave')
      if (saved && !docStore.rawText) {
        docStore.updateRawText(saved)
        toast.show('已恢复上次编辑内容', 'info')
      }
      return saved
    } catch {
      return null
    }
  }

  onMounted(() => {
    restoreAutoSave()
  })

  return { restoreAutoSave }
}
