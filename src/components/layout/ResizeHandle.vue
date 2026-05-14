<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  resize: [pct: number]
}>()

const dragging = ref(false)

function onMouseDown(e: MouseEvent) {
  dragging.value = true
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  const container = (e.target as HTMLElement).parentElement
  if (!container) return
  const rect = container.getBoundingClientRect()
  const pct = ((e.clientX - rect.left) / rect.width) * 100
  emit('resize', Math.max(20, Math.min(80, pct)))
}

function onMouseUp() {
  dragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}
</script>

<template>
  <div class="resize-handle" :class="{ dragging }" @mousedown="onMouseDown">
    <div class="resize-bar" />
  </div>
</template>

<style scoped>
.resize-handle {
  width: 6px;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  flex-shrink: 0;
}

.resize-handle:hover,
.resize-handle.dragging {
  background: #d0d0d0;
}

.resize-bar {
  width: 2px;
  height: 40px;
  background: #bbb;
  border-radius: 1px;
}
</style>
