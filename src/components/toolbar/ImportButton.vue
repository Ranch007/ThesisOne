<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFileImport } from '@/composables/useFileImport'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import Spinner from '@/components/shared/Spinner.vue'

const { importFromFile, importing, importError, pendingImportConfirm, confirmImport } = useFileImport()
const root = ref<HTMLElement>()
const showMenu = ref(false)
const fileInput = ref<HTMLInputElement>()

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function onOutsideClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', onOutsideClick))
onUnmounted(() => document.removeEventListener('click', onOutsideClick))

function pickFile(accept: string) {
  if (fileInput.value) {
    fileInput.value.accept = accept
    fileInput.value.click()
  }
  showMenu.value = false
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) await importFromFile(file)
  input.value = ''
}
</script>

<template>
  <div ref="root" class="import-button">
    <button :disabled="importing" @click="toggleMenu" aria-label="导入文件">
      <Spinner v-if="importing" :size="14" />
      <span v-else>导入</span>
    </button>
    <div v-if="showMenu" class="dropdown-menu">
      <button @click="pickFile('.docx')">Word 文档 (.docx)</button>
      <button @click="pickFile('.txt')">纯文本 (.txt)</button>
      <button @click="pickFile('.md')">Markdown (.md)</button>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      @change="onFileChange"
    />
    <div v-if="importError" class="import-error">{{ importError }}</div>

    <ConfirmDialog
      :show="pendingImportConfirm !== null"
      title="确认导入"
      :message="`编辑区已有内容，导入 ${pendingImportConfirm?.name ?? ''} 将覆盖当前内容。是否继续？`"
      confirm-text="覆盖导入"
      cancel-text="取消"
      @confirm="confirmImport(true)"
      @cancel="confirmImport(false)"
    />
  </div>
</template>

<style scoped>
.import-button {
  position: relative;
}

button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

button:hover {
  background: #f0f0f0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 180px;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  border-radius: 0;
  padding: 8px 14px;
}

.dropdown-menu button:hover {
  background: #e8f0fe;
}

.import-error {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  color: #d32f2f;
  font-size: 12px;
  white-space: nowrap;
}
</style>
