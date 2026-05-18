import { watch, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import { useReferencesStore } from '@/stores/references'
import { useValidationStore } from '@/stores/validation'
import { parseSections } from '@/parser'
import { validateFormat } from '@/validator'
import { formatReferenceList } from '@/references'
import { NodeType } from '@/types/ast'
import { uid } from '@/utils/uid'

/** 文档解析桥接：监听各章节内容 + discipline → 防抖解析 → 更新 AST → 自动校验 */
export function useDocumentParser() {
  const docStore = useDocumentStore()
  const configStore = useConfigStore()
  const refStore = useReferencesStore()
  const valStore = useValidationStore()
  const { sections } = storeToRefs(docStore)
  const { config } = storeToRefs(configStore)
  const debounceMs = ref(300)

  let timer: ReturnType<typeof setTimeout> | null = null
  let parseVersion = 0

  const combinedSections = computed(() => ({
    abstractZh: sections.value.abstractZh,
    abstractEn: sections.value.abstractEn,
    body: sections.value.body,
    acknowledgement: sections.value.acknowledgement,
    appendix: sections.value.appendix,
  }))

  function doParse(version: number) {
    const isEmpty = Object.values(combinedSections.value).every((s) => !s)
    if (isEmpty) {
      docStore.clearAll()
      valStore.clearIssues()
      return
    }
    if (version !== parseVersion) return
    try {
      docStore.setParsing()
      const ast = parseSections(combinedSections.value, {
        discipline: config.value.discipline,
      })
      if (version !== parseVersion) return

      // 将参考文献表单数据同步到 AST（供预览和导出使用）
      if (refStore.items.length > 0) {
        const formatted = formatReferenceList(refStore.items)
        ast.backMatter.references = formatted.map((text) => ({
          id: uid(),
          type: NodeType.REF_ITEM,
          text,
          lineNumber: 0,
        }))
        // 正文有引用标记时才显示参考文献标题
        const hasCitation = /\[\d+\]/.test(combinedSections.value.body)
        if (hasCitation) {
          ast.backMatter.references.unshift({
            id: uid(),
            type: NodeType.REF_TITLE,
            text: '参考文献',
            lineNumber: 0,
          })
        }
      }

      if (version !== parseVersion) return
      docStore.setAST(ast)
      const issues = validateFormat(ast, refStore.items)
      if (version !== parseVersion) return
      valStore.setIssues(issues)
    } catch (e) {
      if (version !== parseVersion) return
      docStore.setParseError(e instanceof Error ? e.message : '解析失败')
    }
  }

  watch(
    [combinedSections, () => config.value.discipline, () => refStore.items],
    () => {
      if (timer) clearTimeout(timer)
      const v = ++parseVersion
      timer = setTimeout(() => doParse(v), debounceMs.value)
    },
    { immediate: false },
  )

  return { doParse, debounceMs }
}
