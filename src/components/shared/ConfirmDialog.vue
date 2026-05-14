<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div v-if="show" class="confirm-overlay" @click.self="emit('cancel')">
    <div class="confirm-dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="confirm-actions">
        <button class="btn-cancel" @click="emit('cancel')">
          {{ cancelText ?? '取消' }}
        </button>
        <button class="btn-confirm" @click="emit('confirm')">
          {{ confirmText ?? '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, .3);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.confirm-dialog {
  background: #fff; border-radius: 8px; padding: 24px;
  min-width: 320px; max-width: 480px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, .15);
}
.confirm-dialog h3 { margin: 0 0 12px; font-size: 16px; }
.confirm-dialog p { margin: 0 0 20px; color: #666; font-size: 14px; line-height: 1.5; }
.confirm-actions { display: flex; justify-content: flex-end; gap: 8px; }
.btn-cancel {
  padding: 6px 16px; border: 1px solid #ddd; border-radius: 4px;
  background: #fff; cursor: pointer; font-size: 13px;
}
.btn-confirm {
  padding: 6px 16px; border: none; border-radius: 4px;
  background: #1a73e8; color: #fff; cursor: pointer; font-size: 13px;
}
</style>
