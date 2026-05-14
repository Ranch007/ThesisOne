import { ref, computed } from 'vue'

export interface PageMetrics {
  pageWidth: number
  pageHeight: number
  contentHeight: number
  lineHeight: number
}

/** DOM 分页计算 */
export function usePagination(metrics: PageMetrics) {
  const totalParagraphs = ref(0)
  const currentPage = ref(1)
  const showFullPreview = ref(true)
  const MAX_SAMPLE_PARAGRAPHS = 200

  const totalPages = computed(() => {
    if (totalParagraphs.value === 0) return 1
    const linesPerPage = Math.floor(metrics.contentHeight / metrics.lineHeight)
    return Math.max(1, Math.ceil(totalParagraphs.value / Math.max(1, linesPerPage)))
  })

  const isSampled = computed(() => totalParagraphs.value > MAX_SAMPLE_PARAGRAPHS)

  function setParagraphCount(count: number) {
    totalParagraphs.value = count
  }

  function toggleFullPreview() {
    showFullPreview.value = !showFullPreview.value
  }

  return { currentPage, totalPages, isSampled, showFullPreview, setParagraphCount, toggleFullPreview, MAX_SAMPLE_PARAGRAPHS }
}
