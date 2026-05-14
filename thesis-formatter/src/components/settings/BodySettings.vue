<script setup lang="ts">
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const c = () => configStore.config

function updateBody(key: string, value: number) {
  configStore.updateConfig({ body: { ...c().body, [key]: value } })
}
</script>

<template>
  <div class="settings-panel">
    <label>
      行距 (磅)
      <input
        type="number"
        :value="c().body.lineSpacing / 20"
        @input="updateBody('lineSpacing', +($event.target as HTMLInputElement).value * 20)"
      />
    </label>
    <label>
      首行缩进 (字符)
      <input
        type="number"
        :value="c().body.firstLineIndent"
        @input="updateBody('firstLineIndent', +($event.target as HTMLInputElement).value)"
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
