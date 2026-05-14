<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import PageFlow from './PageFlow.vue'

const docStore = useDocumentStore()
const configStore = useConfigStore()
const { ast, parseStatus, parseError } = storeToRefs(docStore)
const { config } = storeToRefs(configStore)

const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const zoom = ref(100)

function zoomIn() { zoom.value = Math.min(150, zoom.value + 10) }
function zoomOut() { zoom.value = Math.max(50, zoom.value - 10) }

let observer: ResizeObserver | null = null

onMounted(() => {
  if (!containerRef.value) return
  observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) {
      containerWidth.value = entry.contentRect.width
    }
  })
  observer.observe(containerRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="preview-panel">
    <div v-if="parseStatus === 'idle'" class="preview-empty">
      <p class="preview-hint-title">A4 分页预览</p>
      <p class="preview-hint-sub">在左侧编辑区输入论文正文内容，或拖拽 .docx / .txt / .md 文件导入</p>
      <p class="preview-hint-sub">支持社科类（一、（一）、1.）和理工类（1、1.1、1.1.1）标题体系</p>
    </div>

    <div v-else-if="parseStatus === 'parsing'" class="preview-empty">
      正在解析...
    </div>

    <div v-else-if="parseStatus === 'error'" class="preview-empty preview-error">
      <p class="preview-hint-title">解析失败</p>
      <p v-if="parseError" class="preview-hint-sub">{{ parseError }}</p>
      <p class="preview-hint-sub">请检查输入内容格式是否正确</p>
    </div>

    <div v-if="ast" class="zoom-controls">
      <button @click="zoomOut" title="缩小">−</button>
      <span>{{ zoom }}%</span>
      <button @click="zoomIn" title="放大">+</button>
      <button @click="zoom = 100" title="重置">重置</button>
    </div>

    <div v-else-if="ast" ref="containerRef" class="preview-pages" :style="{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }">
      <PageFlow :ast="ast" :config="config" :container-width="containerWidth" />
    </div>
  </div>
</template>

<style scoped>
.preview-panel {
  height: 100%;
  overflow: auto;
  background: #e8e8e8;
  padding: 24px;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  gap: 8px;
}
.preview-hint-title { font-size: 17px; color: #666; margin: 0; }
.preview-hint-sub { font-size: 13px; margin: 0; }

.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  flex-shrink: 0;
}
.zoom-controls button {
  padding: 2px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
.zoom-controls span { font-size: 12px; color: #666; min-width: 40px; text-align: center; }
.zoom-controls button:hover { background: #f0f0f0; }

.preview-error {
  color: #d32f2f;
}

.preview-pages {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}
</style>
