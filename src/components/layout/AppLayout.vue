<script setup lang="ts">
import { ref } from 'vue'
import Toolbar from '@/components/toolbar/Toolbar.vue'
import EditorPanel from '@/components/editor/EditorPanel.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import ResizeHandle from '@/components/layout/ResizeHandle.vue'
import SettingsModal from '@/components/settings/SettingsModal.vue'
import FormatIssuesPanel from '@/components/validation/FormatIssuesPanel.vue'
import { useFormatValidator } from '@/composables/useFormatValidator'
import { useDocumentParser } from '@/composables/useDocumentParser'
import { useAutoSave } from '@/composables/useAutoSave'

const editWidth = ref(50)
const showSettings = ref(false)
const showIssues = ref(false)

useDocumentParser()
useAutoSave()
const { runValidation } = useFormatValidator()

function openSettings() { showSettings.value = true }
function toggleIssues() {
  if (!showIssues.value) runValidation()
  showIssues.value = !showIssues.value
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <h1 class="app-title">江大毕业论文排版工具</h1>
      <span class="app-version" :title="__BUILD_TIME__">v{{ __GIT_COMMIT__ }}</span>
      <Toolbar @open-settings="openSettings" @toggle-issues="toggleIssues" />
    </header>

    <main class="app-main">
      <div class="editor-pane" :style="{ width: editWidth + '%' }">
        <EditorPanel />
      </div>

      <ResizeHandle @resize="(pct: number) => (editWidth = pct)" />

      <div class="preview-pane" :style="{ width: 100 - editWidth + '%' }">
        <PreviewPanel />
      </div>
    </main>

    <SettingsModal :show="showSettings" @close="showSettings = false" />
    <FormatIssuesPanel v-if="showIssues" />
  </div>
</template>

<style scoped>
.app-layout { display: flex; flex-direction: column; height: 100vh; }
.app-header { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 48px; border-bottom: 1px solid #e0e0e0; background: #fff; flex-shrink: 0; }
.app-title { font-size: 18px; font-weight: 600; margin: 0; white-space: nowrap; }
.app-version { font-size: 11px; color: #999; font-family: monospace; flex-shrink: 0; }
.app-main { display: flex; flex: 1; overflow: hidden; }
.editor-pane, .preview-pane { overflow: auto; min-width: 200px; }
</style>
