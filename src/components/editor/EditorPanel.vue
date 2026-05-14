<script setup lang="ts">
import { ref } from 'vue'
import TextEditor from './TextEditor.vue'
import ReferenceEditor from './ReferenceEditor.vue'
import CoverEditor from './CoverEditor.vue'
import DropZone from './DropZone.vue'

const activeTab = ref<'text' | 'references' | 'cover'>('text')
</script>

<template>
  <div class="editor-panel">
    <nav class="editor-tabs">
      <button :class="{ active: activeTab === 'text' }" @click="activeTab = 'text'">正文</button>
      <button :class="{ active: activeTab === 'references' }" @click="activeTab = 'references'">参考文献</button>
      <button :class="{ active: activeTab === 'cover' }" @click="activeTab = 'cover'">封面信息</button>
    </nav>

    <div class="editor-content">
      <TextEditor v-if="activeTab === 'text'" />
      <ReferenceEditor v-else-if="activeTab === 'references'" />
      <CoverEditor v-else-if="activeTab === 'cover'" />
    </div>

    <DropZone />
  </div>
</template>

<style scoped>
.editor-panel { display: flex; flex-direction: column; height: 100%; position: relative; }
.editor-tabs { display: flex; border-bottom: 1px solid #e0e0e0; flex-shrink: 0; }
.editor-tabs button { padding: 8px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #666; border-bottom: 2px solid transparent; }
.editor-tabs button.active { color: #1a73e8; border-bottom-color: #1a73e8; }
.editor-content { flex: 1; overflow: hidden; }
</style>
