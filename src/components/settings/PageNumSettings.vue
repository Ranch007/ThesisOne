<script setup lang="ts">
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const c = () => configStore.config

function updatePageNum(key: string, value: number | boolean) {
  configStore.updateConfig({
    pageNumber: { ...c().pageNumber, [key]: value },
  })
}
</script>

<template>
  <div class="settings-panel">
    <label>
      正文起始页码
      <input
        type="number"
        :value="c().pageNumber.bodyStartPage"
        @input="updatePageNum('bodyStartPage', +($event.target as HTMLInputElement).value)"
      />
    </label>
    <label>
      前置使用罗马数字
      <input
        type="checkbox"
        :checked="c().pageNumber.useRomanForFront"
        @change="updatePageNum('useRomanForFront', ($event.target as HTMLInputElement).checked)"
      />
    </label>
  </div>
</template>

<style scoped>
.settings-panel label {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; font-size: 14px;
}
.settings-panel input[type="number"] {
  width: 80px; padding: 4px 8px;
  border: 1px solid #ddd; border-radius: 4px;
}
</style>
