<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDocumentStore } from '@/stores/document'
import { useReferencesStore } from '@/stores/references'
import { storeToRefs } from 'pinia'
import TextEditor from './TextEditor.vue'
import ReferenceEditor from './ReferenceEditor.vue'
import CoverEditor from './CoverEditor.vue'
import DropZone from './DropZone.vue'

const docStore = useDocumentStore()
const refStore = useReferencesStore()
const { rawText, paragraphCount } = storeToRefs(docStore)
const { count: refCount } = storeToRefs(refStore)

const charCount = computed(() => rawText.value.length)
const activeTab = ref<'text' | 'references' | 'cover'>('text')

function clearText() {
  if (!docStore.hasContent) return
  docStore.clearAll()
}
</script>

<template>
  <div class="editor-panel">
    <nav class="editor-tabs">
      <button :class="{ active: activeTab === 'text' }" @click="activeTab = 'text'">正文</button>
      <button :class="{ active: activeTab === 'references' }" @click="activeTab = 'references'">
        参考文献<span v-if="refCount > 0" class="tab-count">{{ refCount }}</span>
      </button>
      <button :class="{ active: activeTab === 'cover' }" @click="activeTab = 'cover'">封面信息</button>
    </nav>

    <div class="editor-content">
      <TextEditor v-if="activeTab === 'text'" />
      <ReferenceEditor v-else-if="activeTab === 'references'" />
      <CoverEditor v-else-if="activeTab === 'cover'" />
    </div>

    <footer class="editor-status">
      <span class="status-stats">
        {{ charCount }} 字 · {{ paragraphCount }} 段
      </span>
      <button
        v-if="docStore.hasContent"
        class="status-clear"
        @click="clearText"
      >
        清空
      </button>
    </footer>

    <DropZone />
  </div>
</template>

<style scoped>
.editor-panel { display: flex; flex-direction: column; height: 100%; position: relative; }
.editor-tabs { display: flex; border-bottom: 1px solid #e0e0e0; flex-shrink: 0; }
.editor-tabs button { padding: 8px 16px; border: none; background: none; cursor: pointer; font-size: 14px; color: #666; border-bottom: 2px solid transparent; }
.editor-tabs button.active { color: #1a73e8; border-bottom-color: #1a73e8; }
.tab-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: #1a73e8; color: #fff; font-size: 11px; margin-left: 4px; }
.editor-content { flex: 1; overflow: hidden; }
.editor-status { display: flex; align-items: center; justify-content: space-between; padding: 4px 12px; border-top: 1px solid #eee; background: #fafafa; flex-shrink: 0; }
.status-stats { font-size: 11px; color: #999; }
.status-clear { border: none; background: none; color: #d32f2f; font-size: 11px; cursor: pointer; }
.status-clear:hover { text-decoration: underline; }
</style>
