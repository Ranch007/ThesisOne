<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { NodeType } from '@/types/ast'

const docStore = useDocumentStore()
const { ast } = storeToRefs(docStore)

const tocItems = computed(() => {
  return ast.value?.body.filter(
    (n) =>
      n.type === NodeType.HEADING_1 ||
      n.type === NodeType.HEADING_2 ||
      n.type === NodeType.HEADING_3,
  ) ?? []
})
</script>

<template>
  <div class="toc-preview">
    <div v-if="tocItems.length > 0" class="toc-list">
      <p
        v-for="(item, i) in tocItems"
        :key="i"
        :class="['toc-preview-item', `toc-preview-lv${item.level ?? 1}`]"
      >
        {{ item.text }}
      </p>
    </div>
    <p v-else class="toc-empty-hint">
      在"正文"章节中输入带标题层级的内容后，目录将自动生成。
    </p>
  </div>
</template>

<style scoped>
.toc-preview {
  padding: 4px 0;
}
.toc-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toc-preview-item {
  margin: 0;
  font-family: 'Times New Roman', '宋体', serif;
  font-size: 12pt;
  line-height: 2;
  color: #333;
}
.toc-preview-lv2 { padding-left: 2em; }
.toc-preview-lv3 { padding-left: 4em; }
.toc-empty-hint {
  color: #999;
  font-size: 12pt;
  text-align: center;
  padding: 20px 0;
  margin: 0;
}
</style>
