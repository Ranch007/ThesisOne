import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import { parseThesis } from '@/parser'

/** 文档解析桥接：监听 rawText + discipline → 防抖解析 → 更新 AST */
export function useDocumentParser() {
  const docStore = useDocumentStore()
  const configStore = useConfigStore()
  const { rawText } = storeToRefs(docStore)
  const { config } = storeToRefs(configStore)
  const debounceMs = ref(300)

  let timer: ReturnType<typeof setTimeout> | null = null

  function doParse() {
    if (!rawText.value) {
      docStore.clearAll()
      return
    }
    try {
      docStore.setParsing()
      const ast = parseThesis(rawText.value, {
        discipline: config.value.discipline,
      })
      docStore.setAST(ast)
    } catch (e) {
      docStore.setParseError(e instanceof Error ? e.message : '解析失败')
    }
  }

  // 防抖监听文本和学科变更
  watch(
    [rawText, () => config.value.discipline],
    () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(doParse, debounceMs.value)
    },
    { immediate: false },
  )

  return { doParse, debounceMs }
}
