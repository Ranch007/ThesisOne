<script setup lang="ts">
defineProps<{
  title: string
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="modal-close" @click="emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 16px;
}

.modal-close {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}
</style>
