<script setup lang="ts">
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const c = () => configStore.config

function updateH1(key: string, value: number) {
  configStore.updateConfig({ heading1: { ...c().heading1, [key]: value } })
}
function updateH2(key: string, value: number) {
  configStore.updateConfig({ heading2: { ...c().heading2, [key]: value } })
}
function updateH3(key: string, value: number) {
  configStore.updateConfig({ heading3: { ...c().heading3, [key]: value } })
}
</script>

<template>
  <div class="settings-panel">
    <div class="section">
      <h4>一级标题</h4>
      <label>
        字号 (pt)
        <input
          type="number"
          :value="c().heading1.fontSize / 2"
          @input="updateH1('fontSize', +($event.target as HTMLInputElement).value * 2)"
        />
      </label>
    </div>
    <div class="section">
      <h4>二级标题</h4>
      <label>
        字号 (pt)
        <input
          type="number"
          :value="c().heading2.fontSize / 2"
          @input="updateH2('fontSize', +($event.target as HTMLInputElement).value * 2)"
        />
      </label>
      <label>
        缩进 (字符)
        <input
          type="number"
          :value="c().heading2.indentChars"
          @input="updateH2('indentChars', +($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>
    <div class="section">
      <h4>三级标题</h4>
      <label>
        字号 (pt)
        <input
          type="number"
          :value="c().heading3.fontSize / 2"
          @input="updateH3('fontSize', +($event.target as HTMLInputElement).value * 2)"
        />
      </label>
      <label>
        缩进 (字符)
        <input
          type="number"
          :value="c().heading3.indentChars"
          @input="updateH3('indentChars', +($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
.section { margin-bottom: 12px; }
.section h4 { margin: 0 0 8px; font-size: 14px; }
.section label {
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 0; font-size: 14px;
}
.section input {
  width: 80px; padding: 4px 8px;
  border: 1px solid #ddd; border-radius: 4px;
}
</style>
