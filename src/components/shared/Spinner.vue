<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
  <div
    class="spinner"
    :style="{ width: (size ?? 24) + 'px', height: (size ?? 24) + 'px' }"
  />
</template>

<style scoped>
.spinner {
  border: 3px solid #eee;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin .6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
