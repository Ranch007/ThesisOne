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
const tocItems = computed(() => {
  return props.ast.body.filter(
    (n) =>
      n.type === NodeType.HEADING_1 ||
      n.type === NodeType.HEADING_2 ||
      n.type === NodeType.HEADING_3,
  )
})

const hasTocTitle = computed(() => props.ast.frontMatter.toc.length > 0)


// ── 正文节点（分页） ──────────────────────────
const bodyNodes = computed(() => props.ast.body)

// ── 后置节点 ──────────────────────────────────
const backNodes = computed(() => {
  const bm = props.ast.backMatter
  return [...bm.references, ...bm.acknowledgement, ...bm.appendices]
})

// ── 分页工具 ──────────────────────────────────
function paginate(nodes: DocumentNode[]): DocumentNode[][] {
  const limit = isSampled.value && !showFullPreview.value ? 200 : nodes.length
  const sliced = nodes.slice(0, limit)

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
}

// ── 分页结果 ──────────────────────────────────
const bodyPages = computed(() => {
  const result = paginate(bodyNodes.value)
  setParagraphCount(bodyNodes.value.length)
  return result
})

const backPages = computed(() => paginate(backNodes.value))

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
      <button @click="toggleFullPreview">
        展示全部
      </button>
    </div>

    <!-- 封面页 -->
    <div v-if="hasCover" class="a4-page cover-page">
      <div class="cover-content">
        <p class="cover-university">{{ config.cover.university }}</p>
        <p class="cover-doc-type">本科毕业论文（设计）</p>
        <div class="cover-spacer" />
        <p class="cover-title">{{ coverNodes[0]?.text || config.cover.thesisTitle }}</p>
        <div class="cover-spacer" />
        <p class="cover-field">学&emsp;&emsp;院：{{ config.cover.college }}</p>
        <p class="cover-field">专&emsp;&emsp;业：{{ config.cover.major }}</p>
        <p class="cover-field">学&emsp;&emsp;号：{{ config.cover.studentId }}</p>
        <p class="cover-field">学生姓名：{{ config.cover.studentName }}</p>
        <p class="cover-field">指导教师：{{ config.cover.advisor }}</p>
        <p class="cover-field">提交日期：{{ config.cover.submissionDate }}</p>
      </div>
    </div>

    <!-- 中英文摘要 -->
    <A4Page
      v-if="frontNodes.length > 0"
      :nodes="frontNodes"
      page-label=""
    />

    <!-- 目录页 -->
    <div v-if="hasTocTitle || tocItems.length > 0" class="a4-page toc-page">
      <div class="toc-content">
        <p class="toc-title">目&emsp;录</p>
        <template v-if="tocItems.length > 0">
          <p
            v-for="(node, i) in tocItems"
            :key="'toc-' + i"
            class="toc-item"
            :class="{
              'toc-level-2': node.level === 2,
              'toc-level-3': node.level === 3,
            }"
          >
            <span>{{ node.text }}</span>
          </p>
        </template>
        <p v-else class="toc-empty">正文中未检测到标题，无法生成目录</p>
      </div>
    </div>

    <!-- 正文分页（从 1 起编） -->
    <A4Page
      v-for="(pageNodes, idx) in bodyPages"
      :key="'body-' + idx"
      :nodes="pageNodes"
      :page-label="`${idx + 1}`"
    />

    <!-- 后置内容（接正文页码） -->
    <A4Page
      v-for="(pageNodes, idx) in backPages"
      :key="'back-' + idx"
      :nodes="pageNodes"
      :page-label="`${bodyPages.length + idx + 1}`"
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
  min-height: calc(1123px - 192px);
  gap: 12px;
  padding-top: 80px;
}

.cover-university {
  font-weight: bold;
  font-size: 16pt;
}

.cover-doc-type {
  font-weight: bold;
  font-size: 16pt;
  margin-bottom: 24px;
}

.cover-spacer {
  height: 24px;
}

.cover-title {
  font-weight: bold;
  font-size: 18pt;
  text-align: center;
}

.cover-field {
  font-size: 12pt;
  text-align: center;
}

/* 目录 */
.toc-content {
  min-height: calc(1123px - 192px);
}
.toc-title {
  font-weight: bold;
  font-size: 16pt;
  text-align: center;
  margin-bottom: 32px;
}
.toc-item {
  font-size: 12pt;
  line-height: 2;
  display: flex;
  justify-content: space-between;
}
.toc-item::after {
  content: '…';
  flex: 1;
  text-align: right;
  overflow: hidden;
  direction: rtl;
}
.toc-level-2 { padding-left: 2em; }
.toc-level-3 { padding-left: 4em; }
.toc-empty { text-align: center; color: #999; font-size: 12pt; margin-top: 48px; }

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
