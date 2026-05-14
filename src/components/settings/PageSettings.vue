<script setup lang="ts">
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const m = () => configStore.config.margins

function updateMargins(field: string, value: number) {
  configStore.updateConfig({
    margins: { ...configStore.config.margins, [field]: value },
  })
}
</script>

<template>
  <div class="settings-panel">
    <label>
      上边距 (cm)
      <input
        type="number"
        :value="m().top"
        @input="updateMargins('top', +($event.target as HTMLInputElement).value)"
        step="0.1"
      />
    </label>
    <label>
      下边距 (cm)
      <input
        type="number"
        :value="m().bottom"
        @input="updateMargins('bottom', +($event.target as HTMLInputElement).value)"
        step="0.1"
      />
    </label>
    <label>
      左边距 (cm)
      <input
        type="number"
        :value="m().left"
        @input="updateMargins('left', +($event.target as HTMLInputElement).value)"
        step="0.1"
      />
    </label>
    <label>
      右边距 (cm)
      <input
        type="number"
        :value="m().right"
        @input="updateMargins('right', +($event.target as HTMLInputElement).value)"
        step="0.1"
      />
    </label>
  </div>
</template>

<style scoped>
.settings-panel label {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; font-size: 14px;
}
.settings-panel input {
  width: 80px; padding: 4px 8px;
  border: 1px solid #ddd; border-radius: 4px;
}
</style>
