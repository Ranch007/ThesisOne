<script setup lang="ts">
import { useFileExport } from '@/composables/useFileExport'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'

const { doExport, exporting, pendingConfirm, confirmExport } = useFileExport()
</script>

<template>
  <button :disabled="exporting" @click="doExport">
    {{ exporting ? '导出中...' : '导出 DOCX' }}
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
}
button:hover { background: #f0f0f0; }
button:disabled { opacity: .5; cursor: not-allowed; }
</style>
