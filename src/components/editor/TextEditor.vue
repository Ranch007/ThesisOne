<script setup lang="ts">
import { useDocumentStore } from '@/stores/document'
import { storeToRefs } from 'pinia'

const docStore = useDocumentStore()
const { rawText } = storeToRefs(docStore)
</script>

<template>
  <textarea
    class="text-editor"
    :value="rawText"
    @input="docStore.updateRawText(($event.target as HTMLTextAreaElement).value)"
    placeholder="在此粘贴论文正文内容，或拖拽 .docx / .txt / .md 文件到此处..."
    spellcheck="false"
  />
</template>

<style scoped>
.text-editor {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.8;
  outline: none;
  background: #fafafa;
}

.text-editor::placeholder {
  color: #bbb;
}
</style>
