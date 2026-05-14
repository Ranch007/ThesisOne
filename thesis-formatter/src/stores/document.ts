import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThesisAST } from '@/types/ast'

export const useDocumentStore = defineStore('document', () => {
  const rawText = ref('')
  const ast = ref<ThesisAST | null>(null)
  const parseStatus = ref<'idle' | 'parsing' | 'done' | 'error'>('idle')
  const parseError = ref<string | null>(null)
  const isDirty = ref(false)

  const paragraphCount = computed(() => ast.value?.body.length ?? 0)
  const hasContent = computed(() => rawText.value.length > 0)

  function updateRawText(text: string) {
    rawText.value = text
    isDirty.value = true
  }

  function setAST(newAST: ThesisAST) {
    ast.value = newAST
    parseStatus.value = 'done'
    parseError.value = null
  }

  function setParseError(error: string) {
    parseStatus.value = 'error'
    parseError.value = error
  }

  function setParsing() {
    parseStatus.value = 'parsing'
    parseError.value = null
  }

  function clearAll() {
    rawText.value = ''
    ast.value = null
    parseStatus.value = 'idle'
    parseError.value = null
    isDirty.value = false
  }

  return {
    rawText, ast, parseStatus, parseError, isDirty,
    paragraphCount, hasContent,
    updateRawText, setAST, setParseError, setParsing, clearAll,
  }
})
