import { watch, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import { useReferencesStore } from '@/stores/references'
import { useValidationStore } from '@/stores/validation'
import { parseSections } from '@/parser'
import { validateFormat } from '@/validator'

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
    [combinedSections, () => config.value.discipline],
    () => {
      if (timer) clearTimeout(timer)
      const v = ++parseVersion
      timer = setTimeout(() => doParse(v), debounceMs.value)
    },
    { immediate: false },
  )

  return { doParse, debounceMs }
}
