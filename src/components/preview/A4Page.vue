<script setup lang="ts">
import type { DocumentNode } from '@/types/ast'
import { NodeType } from '@/types/ast'

defineProps<{
  nodes: DocumentNode[] | { type: string; text: string }[]
  pageLabel?: string
}>()

function getNodeClass(node: { type: string; level?: number }): string {
  const t = node.type
  if (t === NodeType.HEADING_1) return 'heading-1'
  if (t === NodeType.HEADING_2) return 'heading-2'
  if (t === NodeType.HEADING_3) return 'heading-3'
  if (t === NodeType.FIGURE_CAPTION) return 'figure-caption'
  if (t === NodeType.TABLE_CAPTION) return 'table-caption'
  if (t === NodeType.FORMULA) return 'formula'
  if (t === NodeType.THESIS_TITLE || t === 'title') return 'thesis-title'
  if (t === NodeType.AUTHOR_INFO) return 'author-info'
  if (t === NodeType.ABSTRACT_ZH_TITLE || t === NodeType.ABSTRACT_EN_TITLE) return 'abstract-title'
  if (t === NodeType.KEYWORDS_ZH || t === NodeType.KEYWORDS_EN) return 'keywords'
  if (t === NodeType.TOC_TITLE || t === NodeType.REF_TITLE || t === NodeType.ACK_TITLE || t === NodeType.APPENDIX_TITLE) return 'section-title'
  if (t === NodeType.REF_ITEM) return 'body-text ref-item'
  if (t === NodeType.PARAGRAPH || t === NodeType.ABSTRACT_ZH_CONTENT || t === NodeType.ABSTRACT_EN_CONTENT || t === NodeType.ACK_CONTENT || t === NodeType.APPENDIX_CONTENT) return 'body-text'
  return 'body-text'
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

/* 正文段落：首行缩进 2 字符 */
.a4-content .body-text {
  text-indent: 2em;
}

/* 一级标题：3号黑体居中，上下空行 */
.a4-content .heading-1 {
  font-weight: bold;
  font-size: 16pt;
  text-align: center;
  margin: 16px 0 8px;
  text-indent: 0;
}

/* 二级标题：4号黑体左缩进 2 字符 */
.a4-content .heading-2 {
  font-weight: bold;
  font-size: 14pt;
  padding-left: 2em;
  margin: 12px 0 6px;
  text-indent: 0;
}

/* 三级标题：小4号黑体左缩进 2 字符 */
.a4-content .heading-3 {
  font-weight: bold;
  font-size: 12pt;
  padding-left: 2em;
  margin: 8px 0 4px;
  text-indent: 0;
}

/* 图题/表题：黑体五号居中 */
.a4-content .figure-caption,
.a4-content .table-caption {
  font-size: 10.5pt;
  text-align: center;
  margin: 6px 0;
  text-indent: 0;
}

/* 论文题目：小2号黑体居中 */
.a4-content .thesis-title {
  font-weight: bold;
  font-size: 18pt;
  text-align: center;
  margin-bottom: 24px;
  text-indent: 0;
}

/* 署名信息 */
.a4-content .author-info {
  text-align: center;
  text-indent: 0;
}

/* 摘要/关键词题头：3号黑体居中 */
.a4-content .abstract-title {
  font-weight: bold;
  font-size: 16pt;
  text-align: center;
  margin: 16px 0 8px;
  text-indent: 0;
}

/* 关键词 */
.a4-content .keywords {
  text-indent: 0;
}

/* 章节标题（参考文献、致谢等）：4号黑体居中 */
.a4-content .section-title {
  font-weight: bold;
  font-size: 14pt;
  text-align: center;
  margin: 16px 0 12px;
  text-indent: 0;
}

/* 参考文献条目：5号字 */
.a4-content .ref-item {
  font-size: 10.5pt;
  padding-left: 2em;
  text-indent: -2em;
}

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
