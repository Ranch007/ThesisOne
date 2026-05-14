<script setup lang="ts">
import { useFileExport } from '@/composables/useFileExport'

const { doExport, exporting } = useFileExport()
</script>

<template>
  <button :disabled="exporting" @click="doExport">
    {{ exporting ? '导出中...' : '📤 导出 DOCX' }}
  </button>
</template>

<style scoped>
button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

button:hover {
  background: #f0f0f0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
