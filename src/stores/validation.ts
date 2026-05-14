import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FormatIssue } from '@/types/validation'

export const useValidationStore = defineStore('validation', () => {
  const issues = ref<FormatIssue[]>([])
  const lastChecked = ref<Date | null>(null)

  const errorCount = computed(() => issues.value.filter((i) => i.severity === 'error').length)
  const warningCount = computed(() => issues.value.filter((i) => i.severity === 'warning').length)

  function setIssues(newIssues: FormatIssue[]) {
    issues.value = newIssues
    lastChecked.value = new Date()
  }

  function clearIssues() {
    issues.value = []
  }

  function dismissIssue(id: string) {
    issues.value = issues.value.filter((i) => i.id !== id)
  }

  return { issues, lastChecked, errorCount, warningCount, setIssues, clearIssues, dismissIssue }
})
