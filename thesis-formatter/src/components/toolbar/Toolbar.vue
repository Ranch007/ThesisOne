<script setup lang="ts">
import ImportButton from './ImportButton.vue'
import ExportButton from './ExportButton.vue'
import DisciplineSwitch from './DisciplineSwitch.vue'
import SettingsButton from './SettingsButton.vue'
import ValidateButton from './ValidateButton.vue'

const emit = defineEmits<{
  'open-settings': []
  'toggle-issues': []
}>()
</script>

<template>
  <nav class="toolbar">
    <ImportButton />
    <ExportButton />
    <div class="toolbar-separator" />
    <DisciplineSwitch />
    <SettingsButton @click="emit('open-settings')" />
    <ValidateButton @click="emit('toggle-issues')" />
  </nav>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
}
.toolbar-separator {
  width: 1px;
  height: 20px;
  background: #ddd;
  margin: 0 4px;
}
</style>
