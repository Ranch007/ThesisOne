<script setup lang="ts">
import { ref } from 'vue'
import { useConfigStore } from '@/stores/config'
import Modal from '@/components/shared/Modal.vue'
import PageSettings from './PageSettings.vue'
import HeadingSettings from './HeadingSettings.vue'
import BodySettings from './BodySettings.vue'
import PageNumSettings from './PageNumSettings.vue'

defineProps<{ show: boolean }>()
const emit = defineEmits<{ close: [] }>()

const configStore = useConfigStore()
const activeTab = ref<'page' | 'heading' | 'body' | 'pageNum'>('page')
const tabs = [
  { key: 'page' as const, label: '页面设置' },
  { key: 'heading' as const, label: '标题格式' },
  { key: 'body' as const, label: '正文格式' },
  { key: 'pageNum' as const, label: '页码' },
]

function resetDefaults() {
  configStore.resetToDefault()
}
</script>

<template>
  <Modal :show="show" title="排版设置" @close="emit('close')">
    <div class="settings-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <PageSettings v-if="activeTab === 'page'" />
    <HeadingSettings v-if="activeTab === 'heading'" />
    <BodySettings v-if="activeTab === 'body'" />
    <PageNumSettings v-if="activeTab === 'pageNum'" />

    <div class="settings-footer">
      <button class="btn-reset" @click="resetDefaults">恢复默认值</button>
      <button class="btn-close" @click="emit('close')">关闭</button>
    </div>
  </Modal>
</template>

<style scoped>
.settings-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.settings-tabs button {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: #666;
}

.settings-tabs button.active {
  color: #1a73e8;
  border-bottom: 2px solid #1a73e8;
  margin-bottom: -1px;
}

.settings-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.btn-reset {
  padding: 6px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.btn-close {
  padding: 6px 16px;
  border: 1px solid #1a73e8;
  border-radius: 4px;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
}
</style>
