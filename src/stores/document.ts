import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { ThesisAST } from '@/types/ast'
import type { SectionKey } from '@/types/editor'

export const useDocumentStore = defineStore('document', () => {
  /** 各章节独立文本存储 */
  const sections = reactive<Record<SectionKey, string>>({
    abstractZh: '',
    abstractEn: '',
    body: '',
    acknowledgement: '',
    appendix: '',
  })

  /** 兼容过渡期：rawText 映射到正文 */
  const rawText = computed({
    get: () => sections.body,
    set: (v: string) => { sections.body = v },
  })

  const ast = ref<ThesisAST | null>(null)
  const parseStatus = ref<'idle' | 'parsing' | 'done' | 'error'>('idle')
  const parseError = ref<string | null>(null)
  const isDirty = ref(false)

  const totalCharCount = computed(() =>
    Object.values(sections).reduce((s, c) => s + c.length, 0),
  )

  const paragraphCount = computed(() => ast.value?.body.length ?? 0)
  const hasContent = computed(() => totalCharCount.value > 0)

  function updateSection(key: SectionKey, text: string) {
    sections[key] = text
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
    for (const k of Object.keys(sections) as SectionKey[]) {
      sections[k] = ''
    }
    ast.value = null
    parseStatus.value = 'idle'
    parseError.value = null
    isDirty.value = false
  }

  return {
    sections, rawText,
    ast, parseStatus, parseError, isDirty,
    totalCharCount, paragraphCount, hasContent,
    updateSection, setAST, setParseError, setParsing, clearAll,
  }
})
