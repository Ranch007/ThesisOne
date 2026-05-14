<script setup lang="ts">
import { computed } from 'vue'
import type { ThesisAST, DocumentConfig, DocumentNode } from '@/types'
import { NodeType } from '@/types/ast'
import { usePagination } from '@/composables/usePagination'
import A4Page from './A4Page.vue'

const props = defineProps<{
  ast: ThesisAST
  config: DocumentConfig
  containerWidth?: number
}>()

const metrics = {
  pageWidth: 794,
  pageHeight: 1123,
  contentHeight: 1123 - 192,
  lineHeight: 22,
}

const { isSampled, showFullPreview, toggleFullPreview, setParagraphCount } =
  usePagination(metrics)

const LINES_PER_PAGE = 40

// ── 封面节点 ──────────────────────────────────
const coverNodes = computed<DocumentNode[]>(() => {
  const fm = props.ast.frontMatter
  const nodes: DocumentNode[] = []
  if (fm.title) nodes.push(fm.title)
  if (fm.authorInfo) nodes.push(fm.authorInfo)
  return nodes
})

const hasCover = computed(() => coverNodes.value.length > 0)

// ── 前置节点（摘要+关键词，不含封面） ─────────
const frontNodes = computed(() => {
  const fm = props.ast.frontMatter
  return [...fm.abstractZh, ...fm.abstractEn]
})

// ── 目录节点（标题 + 自动从正文标题生成条目） ──
const tocNodes = computed(() => {
  const nodes: DocumentNode[] = []
  // TOC 标题
  for (const n of props.ast.frontMatter.toc) {
    nodes.push(n)
  }
  // 从正文提取各级标题生成 TOC 条目
  for (const n of props.ast.body) {
    if (
      n.type === NodeType.HEADING_1 ||
      n.type === NodeType.HEADING_2 ||
      n.type === NodeType.HEADING_3
    ) {
      nodes.push({ ...n, type: NodeType.TOC_ITEM })
    }
  }
  return nodes
})

// ── 正文节点（分页） ──────────────────────────
const bodyNodes = computed(() => props.ast.body)

// ── 后置节点 ──────────────────────────────────
const backNodes = computed(() => {
  const bm = props.ast.backMatter
  return [...bm.references, ...bm.acknowledgement, ...bm.appendices]
})

// ── 正文分页 ──────────────────────────────────
const bodyPageCount = computed(() => {
  const nodes = bodyNodes.value
  const limit = isSampled.value && !showFullPreview.value ? 200 : nodes.length
  const sliced = nodes.slice(0, limit)
  setParagraphCount(sliced.length)

  const result: DocumentNode[][] = []
  let current: DocumentNode[] = []
  let lines = 0

  for (const node of sliced) {
    const n = estimateLines(node)
    if (lines + n > LINES_PER_PAGE && current.length > 0) {
      result.push(current)
      current = []
      lines = 0
    }
    current.push(node)
    lines += n
  }
  if (current.length > 0) result.push(current)
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

// ── 全局页码索引 ──────────────────────────────
const coverOffset = computed(() => (hasCover.value ? 1 : 0))
</script>

<template>
  <div class="page-flow">
    <div v-if="isSampled && !showFullPreview" class="sampled-notice">
      预览前 200 段
      <button @click="toggleFullPreview">
        展示全部
      </button>
    </div>

    <!-- 封面页 -->
    <div v-if="hasCover" class="a4-page cover-page">
      <div class="cover-content">
        <p class="cover-title">{{ coverNodes[0]?.text }}</p>
        <p
          v-if="coverNodes[1]"
          class="cover-author"
          v-html="coverNodes[1].text.replace(/\n/g, '<br/>')"
        />
      </div>
    </div>

    <!-- 中英文摘要（合并在封面背页或独立） -->
    <A4Page
      v-if="frontNodes.length > 0"
      :nodes="frontNodes"
      page-label="摘要"
    />

    <!-- 目录页 -->
    <A4Page
      v-if="tocNodes.length > 0"
      :nodes="tocNodes"
      page-label=""
    />

    <!-- 正文分页 -->
    <A4Page
      v-for="(pageNodes, idx) in bodyPageCount"
      :key="'body-' + idx"
      :nodes="pageNodes"
      :page-label="`第 ${idx + 1} 页`"
    />

    <!-- 后置内容 -->
    <A4Page
      v-if="backNodes.length > 0"
      :nodes="backNodes"
      page-label=""
    />

    <!-- 封底 -->
    <div
      v-if="config.backCover.declarationText"
      class="a4-page back-cover-page"
    >
      <div class="back-cover-content">
        <p class="back-cover-text">
          {{ config.backCover.declarationText }}
        </p>
        <div v-if="config.backCover.hasSignature" class="signature-area">
          <span>学生签名：__________</span>
          <span>指导教师签名：__________</span>
        </div>
      </div>
    </div>
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

/* 通用 A4 纸 */
.a4-page {
  width: 794px;
  min-height: 1123px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  padding: 96px 76px 96px 113px;
  box-sizing: border-box;
  font-family: 'Times New Roman', '宋体', serif;
  position: relative;
}

/* 封面 */
.cover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(1123px - 192px);
  gap: 32px;
}

.cover-title {
  font-weight: bold;
  font-size: 18pt;
  text-align: center;
}

.cover-author {
  font-size: 12pt;
  text-align: center;
  line-height: 2;
}

/* 封底 */
.back-cover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(1123px - 192px);
  gap: 48px;
}

.back-cover-text {
  font-size: 12pt;
  text-align: center;
  line-height: 2;
  max-width: 500px;
}

.signature-area {
  display: flex;
  gap: 60px;
  font-size: 12pt;
}
</style>
