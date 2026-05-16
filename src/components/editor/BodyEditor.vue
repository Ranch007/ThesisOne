<script setup lang="ts">
import { useDocumentStore } from '@/stores/document'

const docStore = useDocumentStore()
</script>

<template>
  <textarea
    class="body-textarea"
    :value="docStore.sections.body"
    @input="docStore.updateSection('body', ($event.target as HTMLTextAreaElement).value)"
    placeholder="在此输入正文内容（支持一级/二级/三级标题、图表、公式）..."
    spellcheck="false"
  />
</template>

<style scoped>
.body-textarea {
  width: 100%;
  min-height: 360px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px 14px;
  font-family: 'Times New Roman', '宋体', serif;
  font-size: 12pt;
  line-height: 1.833;
  resize: vertical;
  background: #fff;
  color: #333;
  box-sizing: border-box;
}
.body-textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.12);
}
.body-textarea::placeholder {
  color: #bbb;
  font-size: 11pt;
}
</style>
