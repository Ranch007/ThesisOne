import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import { useReferencesStore } from '@/stores/references'
import { exportDocx } from '@/exporter'
import { useToast } from '@/composables/useToast'

/** DOCX 导出处理 */
export function useFileExport() {
  const docStore = useDocumentStore()
  const configStore = useConfigStore()
  const refStore = useReferencesStore()
  const exporting = ref(false)
  const exportError = ref<string | null>(null)

  // Promise 模式确认对话框——由组件渲染 ConfirmDialog
  const pendingConfirm = ref<string | null>(null)
  let confirmResolve: ((value: boolean) => void) | null = null

  function requestConfirm(message: string): Promise<boolean> {
    pendingConfirm.value = message
    return new Promise((resolve) => {
      confirmResolve = resolve
    })
  }

  function confirmExport(ok: boolean) {
    pendingConfirm.value = null
    confirmResolve?.(ok)
    confirmResolve = null
  }

  function yieldToUI(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()))
  }

  const toast = useToast()

  async function doExport() {
    if (!docStore.ast) {
      toast.show('请先输入论文内容', 'error')
      return
    }

    // 超大文档确认（15,000+ 段落）
    if (docStore.paragraphCount > 15000) {
      const ok = await requestConfirm(
        `当前文档包含 ${docStore.paragraphCount} 个段落，导出可能需要较长时间。是否继续？`,
      )
      if (!ok) return
    }

    exporting.value = true
    exportError.value = null

    // 让出主线程渲染 loading 状态
    await yieldToUI()

    try {
      const blob = await exportDocx({
        ast: docStore.ast,
        config: configStore.config,
        references: refStore.items,
      })
      const rawTitle = docStore.ast?.frontMatter.title?.text
      const filename = rawTitle
        ? `${rawTitle.replace(/[\\/:*?"<>|]/g, '-')}.docx`
        : '毕业论文.docx'
      saveAs(blob, filename)
      toast.show('导出成功', 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '导出失败'
      toast.show(msg, 'error')
    } finally {
      exporting.value = false
    }
  }

  return { doExport, exporting, exportError, pendingConfirm, confirmExport }
}
