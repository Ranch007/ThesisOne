<script setup lang="ts">
import { useValidationStore } from '@/stores/validation'
import { storeToRefs } from 'pinia'
import FormatIssueItem from './FormatIssueItem.vue'

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
      <FormatIssueItem
        v-for="issue in issues"
        :key="issue.id"
        :issue="issue"
        @dismiss="valStore.dismissIssue(issue.id)"
      />
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

</style>
