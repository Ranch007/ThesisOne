import { ref } from 'vue'
import { useDocumentStore } from '@/stores/document'
import { readAsText, readAsArrayBuffer } from '@/utils/file-reader'

/** 文件导入处理 */
export function useFileImport() {
  const docStore = useDocumentStore()
  const importing = ref(false)
  const importError = ref<string | null>(null)

  async function importFromFile(file: File): Promise<void> {
    importing.value = true
    importError.value = null

    try {
      const ext = file.name.split('.').pop()?.toLowerCase()

      if (ext === 'txt') {
        const text = await readAsText(file)
        docStore.updateRawText(text)
      } else if (ext === 'md') {
        const text = await readAsText(file)
        docStore.updateRawText(text)
      } else if (ext === 'docx') {
        // mammoth 提取纯文本
        const { default: mammoth } = await import('mammoth')
        const buffer = await readAsArrayBuffer(file)
        const result = await mammoth.extractRawText({ arrayBuffer: buffer })
        docStore.updateRawText(result.value)
      } else if (ext === 'doc' || ext === 'wps') {
        importError.value = '不支持 .doc/.wps 格式，请先通过 Word/WPS 另存为 .docx 格式再导入。'
      } else {
        importError.value = `不支持的文件格式: .${ext}`
      }
    } catch (e) {
      importError.value = e instanceof Error ? e.message : '文件导入失败'
    } finally {
      importing.value = false
    }
  }

  return { importFromFile, importing, importError }
}
