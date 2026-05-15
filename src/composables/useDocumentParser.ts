import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import { useReferencesStore } from '@/stores/references'
import { useValidationStore } from '@/stores/validation'
import { parseThesis } from '@/parser'
import { validateFormat } from '@/validator'

/** 文档解析桥接：监听 rawText + discipline → 防抖解析 → 更新 AST → 自动检测 */
export function useDocumentParser() {
  const docStore = useDocumentStore()
  const configStore = useConfigStore()
  const refStore = useReferencesStore()
  const valStore = useValidationStore()
  const { rawText } = storeToRefs(docStore)
  const { config } = storeToRefs(configStore)
  const debounceMs = ref(300)

  let timer: ReturnType<typeof setTimeout> | null = null
  let parseVersion = 0

  function doParse(version: number) {
    if (!rawText.value) {
      docStore.clearAll()
      valStore.clearIssues()
      return
    }
    // 防竞态：如果在此解析期间触发了新的变更，放弃本次结果
    if (version !== parseVersion) return
    try {
      docStore.setParsing()
      const ast = parseThesis(rawText.value, {
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

  // 防抖监听文本和学科变更
  watch(
    [rawText, () => config.value.discipline],
    () => {
      if (timer) clearTimeout(timer)
      const v = ++parseVersion
      timer = setTimeout(() => doParse(v), debounceMs.value)
    },
    { immediate: false },
  )

  return { doParse, debounceMs }
}
