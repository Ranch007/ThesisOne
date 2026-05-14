<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

const visible = ref(false)

watch(
  () => props.message,
  (msg) => {
    if (msg) {
      visible.value = true
      setTimeout(() => { visible.value = false }, props.duration ?? 3000)
    }
  },
)
</script>

<template>
  <div v-if="visible" class="toast" :class="type ?? 'info'">
    {{ message }}
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast.success { background: #e8f5e9; color: #2e7d32; }
.toast.error { background: #ffebee; color: #c62828; }
.toast.info { background: #e3f2fd; color: #1565c0; }
</style>
