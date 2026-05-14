<script setup lang="ts">
import { useValidationStore } from '@/stores/validation'
import { storeToRefs } from 'pinia'

const valStore = useValidationStore()
const { issues, errorCount, warningCount } = storeToRefs(valStore)
</script>

<template>
  <div v-if="issues.length > 0" class="issues-panel">
    <div class="issues-header">
      <span class="issues-title">格式检测</span>
      <span class="issues-count">
        <span v-if="errorCount > 0" class="count-error">{{ errorCount }} 错误</span>
        <span v-if="warningCount > 0" class="count-warning">{{ warningCount }} 警告</span>
      </span>
    </div>

    <div class="issues-list">
      <div
        v-for="issue in issues"
        :key="issue.id"
        class="issue-item"
        :class="issue.severity"
      >
        <span class="issue-icon">{{ issue.severity === 'error' ? '✕' : '△' }}</span>
        <span class="issue-message">{{ issue.message }}</span>
        <button class="issue-dismiss" @click="valStore.dismissIssue(issue.id)">忽略</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.issues-panel {
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 360px;
  max-height: 300px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 500;
  display: flex;
  flex-direction: column;
}

.issues-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.issues-title { font-weight: 500; font-size: 14px; }

.issues-count { font-size: 12px; }
.count-error { color: #d32f2f; margin-right: 8px; }
.count-warning { color: #f57c00; }

.issues-list {
  overflow-y: auto;
  flex: 1;
}

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
