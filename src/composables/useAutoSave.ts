import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useToast } from '@/composables/useToast'

/** 自动保存：500ms 防抖同步正文到 localStorage */
export function useAutoSave() {
  const docStore = useDocumentStore()
  const { sections } = storeToRefs(docStore)
  const toast = useToast()

  let timer: ReturnType<typeof setTimeout>

  watch(sections, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        localStorage.setItem('thesis:autosave', JSON.stringify(val))
      } catch { /* 静默 */ }
    }, 500)
  }, { deep: true })

  function restoreAutoSave() {
    try {
      const saved = localStorage.getItem('thesis:autosave')
      if (!saved) return
      const parsed = JSON.parse(saved)
      // 仅在无内容时恢复
      const hasContent = Object.values(parsed).some(
        (v: unknown) => typeof v === 'string' && v.length > 0,
      )
      if (hasContent && !docStore.hasContent) {
        for (const key of Object.keys(parsed)) {
          if (key in docStore.sections) {
            docStore.updateSection(key as keyof typeof docStore.sections, parsed[key])
          }
        }
        toast.show('已恢复上次编辑内容', 'info')
      }
    } catch { /* 静默 */ }
  }

  onMounted(() => {
    restoreAutoSave()
  })

  return { restoreAutoSave }
}
