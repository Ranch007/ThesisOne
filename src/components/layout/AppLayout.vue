<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import Toolbar from '@/components/toolbar/Toolbar.vue'
import EditorPanel from '@/components/editor/EditorPanel.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import ResizeHandle from '@/components/layout/ResizeHandle.vue'
import SettingsModal from '@/components/settings/SettingsModal.vue'
import FormatIssuesPanel from '@/components/validation/FormatIssuesPanel.vue'
import { useFormatValidator } from '@/composables/useFormatValidator'
import { useDocumentParser } from '@/composables/useDocumentParser'
import { useAutoSave } from '@/composables/useAutoSave'
import { useToast } from '@/composables/useToast'
import { useKeyboard } from '@/composables/useKeyboard'
import { useFileExport } from '@/composables/useFileExport'

const { toasts, dismiss } = useToast()
const { runValidation } = useFormatValidator()
const { doExport } = useFileExport()
const editWidth = ref(50)
const showSettings = ref(false)
const showIssues = ref(false)
const appError = ref<string | null>(null)

onErrorCaptured((err) => {
  appError.value = err instanceof Error ? err.message : String(err)
  return false // 阻止错误继续传播
})

useDocumentParser()
useAutoSave()
useKeyboard([
  { key: 's', ctrl: true, handler: () => doExport() },
  { key: 'i', ctrl: true, handler: () => toggleIssues() },
])

function openSettings() { showSettings.value = true }
function toggleIssues() {
  if (!showIssues.value) runValidation()
  showIssues.value = !showIssues.value
}
</script>

<template>
  <div v-if="appError" class="app-error-boundary">
    <h2>应用发生错误</h2>
    <p>{{ appError }}</p>
    <button @click="appError = null">重试</button>
  </div>

  <div v-else class="app-layout">
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

    <!-- Toast 通知 -->
    <div class="toast-container">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast-item"
        :class="t.type"
        @click="dismiss(t.id)"
      >
        {{ t.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-error-boundary { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 16px; font-family: sans-serif; }
.app-error-boundary h2 { margin: 0; color: #d32f2f; }
.app-error-boundary p { color: #666; max-width: 480px; text-align: center; }
.app-error-boundary button { padding: 8px 24px; border: 1px solid #1a73e8; border-radius: 4px; background: #1a73e8; color: #fff; cursor: pointer; font-size: 14px; }
.app-layout { display: flex; flex-direction: column; height: 100vh; }
.app-header { display: flex; align-items: center; justify-content: space-between; padding: 0 16px; height: 48px; border-bottom: 1px solid #e0e0e0; background: #fff; flex-shrink: 0; }
.app-title { font-size: 18px; font-weight: 600; margin: 0; white-space: nowrap; }
.app-version { font-size: 11px; color: #999; font-family: monospace; flex-shrink: 0; }
.app-main { display: flex; flex: 1; overflow: hidden; }
.editor-pane, .preview-pane { overflow: auto; min-width: 200px; }
.toast-container { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 2500; display: flex; flex-direction: column; gap: 8px; }
.toast-item { padding: 10px 24px; border-radius: 6px; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(0, 0, 0, .15); animation: toast-in .25s ease-out; }
.toast-item.success { background: #e8f5e9; color: #2e7d32; }
.toast-item.error { background: #ffebee; color: #c62828; }
.toast-item.info { background: #e3f2fd; color: #1565c0; }
@keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
</style>
