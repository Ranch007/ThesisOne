import { ref } from 'vue'
import { saveAs } from 'file-saver'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import { useReferencesStore } from '@/stores/references'
import { exportDocx } from '@/exporter'

/** DOCX 导出处理 */
export function useFileExport() {
  const docStore = useDocumentStore()
  const configStore = useConfigStore()
  const refStore = useReferencesStore()
  const exporting = ref(false)
  const exportError = ref<string | null>(null)

  async function doExport() {
    if (!docStore.ast) {
      exportError.value = '请先输入论文内容'
      return
    }

    // 超大文档确认（15,000+ 段落）
    if (docStore.paragraphCount > 15000) {
      const confirmed = confirm(
        `当前文档包含 ${docStore.paragraphCount} 个段落，导出可能需要较长时间。是否继续？`,
      )
      if (!confirmed) return
    }

    exporting.value = true
    exportError.value = null

    try {
      const blob = await exportDocx({
        ast: docStore.ast,
        config: configStore.config,
        cover: {
          ...configStore.config.cover,
          thesisTitle: configStore.config.cover.thesisTitle || (docStore.ast?.frontMatter.title?.text ?? ''),
        },
        references: refStore.items,
        backCoverText: configStore.config.backCover.declarationText,
      })
      saveAs(blob, '毕业论文.docx')
    } catch (e) {
      exportError.value = e instanceof Error ? e.message : '导出失败'
    } finally {
      exporting.value = false
    }
  }

  return { doExport, exporting, exportError }
}
