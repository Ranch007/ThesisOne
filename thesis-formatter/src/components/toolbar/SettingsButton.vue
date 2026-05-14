<script setup lang="ts">
defineEmits<{ click: [] }>()
</script>

<template>
  <button class="tool-btn" @click="$emit('click')">设置</button>
</template>

<style scoped>
.tool-btn {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
.tool-btn:hover { background: #f0f0f0; }
</style>
