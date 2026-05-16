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

// ── 前置节点（摘要+关键词） ─────────
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

// ── 目录页码映射：每个标题节点 → 所在正文页码（从 1 起编） ──
const tocPageMap = computed(() => {
  const map = new Map<string, number>()
  bodyPages.value.forEach((page, idx) => {
    for (const node of page) {
      map.set(node.id, idx + 1)
    }
  })
  return map
})


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
            <span class="toc-text">{{ node.text }}</span>
            <span class="toc-leader" />
            <span class="toc-page">{{ tocPageMap.get(node.id) ?? '—' }}</span>
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
  align-items: baseline;
}
.toc-text {
  flex-shrink: 0;
  white-space: nowrap;
}
.toc-leader {
  flex: 1;
  min-width: 1em;
  border-bottom: 1px dotted #666;
  margin: 0 6px;
  align-self: flex-end;
}
.toc-page {
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 1.5em;
  text-align: right;
}
.toc-level-2 { padding-left: 2em; }
.toc-level-3 { padding-left: 4em; }
.toc-empty { text-align: center; color: #999; font-size: 12pt; margin-top: 48px; }

</style>
