<script setup lang="ts">
import { ref } from 'vue'
import { useFileImport } from '@/composables/useFileImport'

const { importFromFile } = useFileImport()
const dragOver = ref(false)

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragOver.value = true
}

function onDragLeave() {
  dragOver.value = false
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await importFromFile(file)
}
</script>

<template>
  <div
    v-if="dragOver"
    class="drop-zone"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="drop-message">
      释放文件以导入
    </div>
  </div>
</template>

<style scoped>
.drop-zone {
  position: absolute;
  inset: 0;
  background: rgba(26, 115, 232, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #1a73e8;
  z-index: 10;
}

.drop-message {
  font-size: 18px;
  color: #1a73e8;
  font-weight: 500;
}
</style>
