import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useReferencesStore } from '@/stores/references'
import { useValidationStore } from '@/stores/validation'
import { validateFormat } from '@/validator'
import type { FormatIssue } from '@/types/validation'

/** 格式检测桥接 —— 调用共享 validator，聚合文档+引用数据 */
export function useFormatValidator() {
  const docStore = useDocumentStore()
  const refStore = useReferencesStore()
  const valStore = useValidationStore()
  const { ast } = storeToRefs(docStore)

  function runValidation(): FormatIssue[] {
    if (!ast.value) {
      valStore.clearIssues()
      return []
    }

    const issues = validateFormat(ast.value, refStore.items)
    valStore.setIssues(issues)
    return issues
  }

  return { runValidation, ...storeToRefs(valStore) }
}
