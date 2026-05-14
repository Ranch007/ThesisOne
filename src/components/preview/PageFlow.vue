<script setup lang="ts">
import { computed } from 'vue'
import type { ThesisAST, DocumentConfig, DocumentNode } from '@/types'
import { NodeType } from '@/types/ast'
import { usePagination } from '@/composables/usePagination'
import A4Page from './A4Page.vue'

const props = defineProps<{
  ast: ThesisAST
  config: DocumentConfig
}>()

const metrics = {
  pageWidth: 794,
  pageHeight: 1123,
  contentHeight: 1123 - 192,
  lineHeight: 22,
}

const { totalPages, setParagraphCount, isSampled, showFullPreview, toggleFullPreview } = usePagination(metrics)

const LINES_PER_PAGE = 40

const allNodes = computed(() => {
  const nodes: DocumentNode[] = []
  const fm = props.ast.frontMatter

  if (fm.title) nodes.push(fm.title)
  if (fm.authorInfo) nodes.push(fm.authorInfo)
  nodes.push(...fm.abstractZh)
  nodes.push(...fm.abstractEn)
  nodes.push(...fm.toc)
  nodes.push(...props.ast.body)
  nodes.push(...props.ast.backMatter.references)
  nodes.push(...props.ast.backMatter.acknowledgement)
  nodes.push(...props.ast.backMatter.appendices)

  setParagraphCount(nodes.length)
  return nodes
})

const pages = computed(() => {
  const nodes = allNodes.value
  const limit = isSampled.value && !showFullPreview.value ? 200 : nodes.length
  const sliced = nodes.slice(0, limit)

  const result: DocumentNode[][] = []
  let currentPage: DocumentNode[] = []
  let lineCount = 0

  for (const node of sliced) {
    const lines = estimateLines(node)
    if (lineCount + lines > LINES_PER_PAGE && currentPage.length > 0) {
      result.push(currentPage)
      currentPage = []
      lineCount = 0
    }
    currentPage.push(node)
    lineCount += lines
  }
  if (currentPage.length > 0) result.push(currentPage)

  return result
})

function estimateLines(node: DocumentNode): number {
  if (node.type === NodeType.HEADING_1) return 3
  if (node.type === NodeType.HEADING_2) return 2
  if (node.type === NodeType.HEADING_3) return 2
  if (
    node.type === NodeType.FIGURE_CAPTION ||
    node.type === NodeType.TABLE_CAPTION
  )
    return 2
  if (node.type === NodeType.FORMULA) return 2
  return 1
}
</script>

<template>
  <div class="page-flow">
    <div v-if="isSampled && !showFullPreview" class="sampled-notice">
      预览前 200 段
      <button @click="toggleFullPreview">展示全部（{{ totalPages }} 页）</button>
    </div>

    <A4Page
      v-for="(pageNodes, idx) in pages"
      :key="idx"
      :nodes="pageNodes"
      :page-label="`第 ${idx + 1} 页`"
    />
  </div>
</template>

<style scoped>
.page-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.sampled-notice {
  padding: 8px 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.sampled-notice button {
  padding: 2px 10px;
  border: 1px solid #1a73e8;
  border-radius: 4px;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
}
</style>
