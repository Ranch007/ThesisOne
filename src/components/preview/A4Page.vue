<script setup lang="ts">
import type { DocumentNode } from '@/types/ast'
import { NodeType } from '@/types/ast'

defineProps<{
  nodes: DocumentNode[] | { type: string; text: string }[]
  pageLabel?: string
}>()

function getNodeClass(node: { type: string; level?: number }): string {
  const t = node.type
  if (t === NodeType.HEADING_1) return 'h1'
  if (t === NodeType.HEADING_2) return 'h2'
  if (t === NodeType.HEADING_3) return 'h3'
  if (t === NodeType.FIGURE_CAPTION || t === NodeType.TABLE_CAPTION) return 'caption'
  if (t === NodeType.FORMULA) return 'formula'
  if (t === 'title' || t === NodeType.THESIS_TITLE) return 'thesis-title'
  if (t === NodeType.TOC_ITEM) return `toc-item toc-l${node.level ?? 1}`
  return ''
}
</script>

<template>
  <div class="a4-page">
    <div class="a4-content">
      <template v-for="(node, i) in nodes" :key="i">
        <p :class="getNodeClass(node)">
          {{ node.text }}
        </p>
      </template>
    </div>
    <div class="a4-footer" v-if="pageLabel">
      <span>{{ pageLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
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

.a4-content {
  min-height: calc(1123px - 192px);
}

.a4-content p {
  margin: 0;
  line-height: 1.833;
  font-size: 12pt;
}

.a4-content .h1 {
  font-weight: bold;
  font-size: 16pt;
  text-align: center;
  margin: 16px 0 8px;
}

.a4-content .h2 {
  font-weight: bold;
  font-size: 14pt;
  margin: 12px 0 6px;
}

.a4-content .h3 {
  font-weight: bold;
  font-size: 12pt;
  margin: 8px 0 4px;
}

.a4-content .caption {
  font-size: 10.5pt;
  text-align: center;
  margin: 6px 0;
}

.a4-content .thesis-title {
  font-weight: bold;
  font-size: 18pt;
  text-align: center;
  margin-bottom: 24px;
}

.a4-content .toc-item {
  display: flex;
  justify-content: space-between;
  line-height: 2;
}

.a4-content .toc-item::after {
  content: '…';
  flex: 1;
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  direction: rtl;
}

.a4-content .toc-l2 { padding-left: 2em; }
.a4-content .toc-l3 { padding-left: 4em; }
.a4-content .formula {
  text-align: center;
  margin: 12px 0;
  font-style: italic;
}

.a4-footer {
  position: absolute;
  bottom: 48px;
  right: 76px;
  font-size: 10.5pt;
  color: #999;
}
</style>
