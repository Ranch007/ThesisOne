<script setup lang="ts">
import type { FormatIssue } from '@/types/validation'

defineProps<{ issue: FormatIssue }>()
const emit = defineEmits<{ dismiss: [] }>()
</script>

<template>
  <div class="issue-item" :class="issue.severity">
    <span class="issue-icon">{{ issue.severity === 'error' ? '✕' : '△' }}</span>
    <span class="issue-message">{{ issue.message }}</span>
    <button class="issue-dismiss" @click="emit('dismiss')">忽略</button>
  </div>
</template>

<style scoped>
.issue-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
}
.issue-item.error .issue-icon { color: #d32f2f; }
.issue-item.warning .issue-icon { color: #f57c00; }
.issue-message { flex: 1; }
.issue-dismiss {
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}
</style>
