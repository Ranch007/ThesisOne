<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useConfigStore } from '@/stores/config'
import PageFlow from './PageFlow.vue'

const docStore = useDocumentStore()
const configStore = useConfigStore()
const { ast, parseStatus } = storeToRefs(docStore)
const { config } = storeToRefs(configStore)
</script>

<template>
  <div class="preview-panel">
    <div v-if="parseStatus === 'idle'" class="preview-empty">
      输入论文内容后，此处将显示 A4 分页预览
    </div>

    <div v-else-if="parseStatus === 'parsing'" class="preview-empty">
      正在解析...
    </div>

    <div v-else-if="parseStatus === 'error'" class="preview-empty preview-error">
      解析失败
    </div>

    <div v-else-if="ast" class="preview-pages">
      <PageFlow :ast="ast" :config="config" />
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
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 15px;
}

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
