<script setup lang="ts">
defineProps<{ errorCount?: number; warningCount?: number }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button class="tool-btn" @click="$emit('click')" aria-label="格式检测">
    格式检测
    <span v-if="errorCount" class="badge error">{{ errorCount }}</span>
    <span v-if="warningCount" class="badge warning">{{ warningCount }}</span>
  </button>
</template>

<style scoped>
.tool-btn {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.tool-btn:hover { background: #f0f0f0; }
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  font-size: 11px;
  color: #fff;
}
.badge.error { background: #d32f2f; }
.badge.warning { background: #f57c00; }
</style>
