import { ref } from 'vue'
import { useDocumentStore } from '@/stores/document'
import { readAsText, readAsArrayBuffer } from '@/utils/file-reader'
import { useToast } from '@/composables/useToast'

/** 文件导入处理 */
export function useFileImport() {
  const docStore = useDocumentStore()
  const toast = useToast()
  const importing = ref(false)
  const importError = ref<string | null>(null)

  // Promise 模式确认——非空导入时由组件渲染 ConfirmDialog
  const pendingImportConfirm = ref<File | null>(null)
  let importConfirmResolve: ((value: boolean) => void) | null = null

  function requestImportConfirm(file: File): Promise<boolean> {
    pendingImportConfirm.value = file
    return new Promise((resolve) => {
      importConfirmResolve = resolve
    })
  }

  function confirmImport(ok: boolean) {
    pendingImportConfirm.value = null
    importConfirmResolve?.(ok)
    importConfirmResolve = null
  }

  async function importFromFile(file: File): Promise<void> {
    // 非空编辑器：确认覆盖
    if (docStore.hasContent) {
      const ok = await requestImportConfirm(file)
      if (!ok) return
    }
    importing.value = true
    importError.value = null

    try {
      const ext = file.name.split('.').pop()?.toLowerCase()

      if (ext === 'txt') {
        const text = await readAsText(file)
        docStore.updateRawText(text)
        toast.show(`已导入 ${file.name}`, 'success')
      } else if (ext === 'md') {
        const text = await readAsText(file)
        docStore.updateRawText(text)
        toast.show(`已导入 ${file.name}`, 'success')
      } else if (ext === 'docx') {
        const { default: mammoth } = await import('mammoth')
        const buffer = await readAsArrayBuffer(file)
        const result = await mammoth.extractRawText({ arrayBuffer: buffer })
        docStore.updateRawText(result.value)
        toast.show(`已导入 ${file.name}`, 'success')
      } else if (ext === 'doc' || ext === 'wps') {
        const msg = '不支持 .doc/.wps 格式，请先通过 Word/WPS 另存为 .docx 格式再导入。'
        importError.value = msg
        toast.show(msg, 'error')
      } else {
        const msg = `不支持的文件格式: .${ext}`
        importError.value = msg
        toast.show(msg, 'error')
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '文件导入失败'
      importError.value = msg
      toast.show(msg, 'error')
    } finally {
      importing.value = false
    }
  }

  return { importFromFile, importing, importError, pendingImportConfirm, confirmImport }
}
