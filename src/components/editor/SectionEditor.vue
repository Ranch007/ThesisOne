<script setup lang="ts">
import type { SectionKey } from '@/types/editor'
import { useDocumentStore } from '@/stores/document'

const props = defineProps<{
  sectionKey: SectionKey
  placeholder?: string
  minRows?: number
}>()

const docStore = useDocumentStore()
</script>

<template>
  <textarea
    class="section-textarea"
    :value="docStore.sections[props.sectionKey]"
    @input="docStore.updateSection(props.sectionKey, ($event.target as HTMLTextAreaElement).value)"
    :placeholder="placeholder ?? ''"
    :rows="minRows ?? 6"
    spellcheck="false"
  />
</template>

<style scoped>
.section-textarea {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px 12px;
  font-family: 'Times New Roman', '宋体', serif;
  font-size: 12pt;
  line-height: 1.833;
  resize: vertical;
  background: #fff;
  color: #333;
  box-sizing: border-box;
}
.section-textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.12);
}
.section-textarea::placeholder {
  color: #bbb;
  font-size: 11pt;
}
</style>
