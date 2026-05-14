<script setup lang="ts">
import { useFileExport } from '@/composables/useFileExport'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import Spinner from '@/components/shared/Spinner.vue'

const { doExport, exporting, pendingConfirm, confirmExport } = useFileExport()
</script>

<template>
  <button :disabled="exporting" @click="doExport" aria-label="导出 DOCX 文件">
    <Spinner v-if="exporting" :size="14" />
    <span v-else>导出 DOCX</span>
  </button>

  <ConfirmDialog
    :show="pendingConfirm !== null"
    title="确认导出"
    :message="pendingConfirm ?? ''"
    confirm-text="继续导出"
    cancel-text="取消"
    @confirm="confirmExport(true)"
    @cancel="confirmExport(false)"
  />
</template>

<style scoped>
button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
button:hover { background: #f0f0f0; }
button:disabled { opacity: .5; cursor: not-allowed; }
</style>
