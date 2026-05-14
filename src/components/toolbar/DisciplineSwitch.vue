<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { Discipline } from '@/types/ast'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)
const toast = useToast()

function toggle() {
  const next =
    config.value.discipline === Discipline.SOCIAL_SCIENCE
      ? Discipline.SCIENCE_ENGINEERING
      : Discipline.SOCIAL_SCIENCE
  configStore.switchDiscipline(next)
  const mode =
    next === Discipline.SOCIAL_SCIENCE
      ? '社科类（一、（一）、1.）'
      : '理工类（1、1.1、1.1.1）'
  toast.show(`已切换至${mode}，解析规则将重新匹配标题`, 'info')
}
</script>

<template>
  <button class="discipline-switch" @click="toggle">
    <span class="label">{{ config.discipline === 'SOCIAL_SCIENCE' ? '社科类' : '理工类' }}</span>
    <span class="hint">
      {{ config.discipline === 'SOCIAL_SCIENCE' ? '一、（一）、1.' : '1、1.1、1.1.1' }}
    </span>
  </button>
</template>

<style scoped>
button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #1a73e8;
  border-radius: 4px;
  background: #e8f0fe;
  cursor: pointer;
  font-size: 13px;
  color: #1a73e8;
}

button:hover {
  background: #d2e3fc;
}

.hint {
  font-size: 11px;
  opacity: 0.7;
}
</style>
