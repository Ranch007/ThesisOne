<script setup lang="ts">
import { ref } from 'vue'
import { useReferencesStore } from '@/stores/references'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'

const refStore = useReferencesStore()
const toast = useToast()
const { items } = storeToRefs(refStore)

const inputText = ref('')

function addReference() {
  const text = inputText.value.trim()
  if (!text) {
    toast.show('请输入参考文献内容', 'error')
    return
  }
  refStore.addRef(text)
  toast.show(`已添加文献 [${items.value.length}]`, 'success')
  inputText.value = ''
}
</script>

<template>
  <div class="ref-editor">
    <div class="ref-input-row">
      <textarea
        v-model="inputText"
        class="ref-textarea"
        placeholder="粘贴参考文献条目（如 GB/T 7714 格式）"
        rows="3"
        spellcheck="false"
        @keydown.enter.ctrl="addReference"
      />
      <button class="btn-add" @click="addReference">添加</button>
    </div>
    <p class="ref-hint">Ctrl+Enter 快捷添加</p>

    <div class="ref-list">
      <div v-for="item in items" :key="item.id" class="ref-item">
        <span class="ref-index">[{{ item.index }}]</span>
        <span class="ref-text">{{ item.rawText }}</span>
        <button class="ref-remove" @click="refStore.removeRef(item.id)" title="删除">×</button>
      </div>
      <div v-if="items.length === 0" class="ref-empty">暂未添加参考文献，正文中用 [1][2] 标记引用</div>
    </div>
  </div>
</template>

<style scoped>
.ref-editor { padding: 8px 0; }
.ref-input-row { display: flex; gap: 8px; align-items: flex-start; }
.ref-textarea {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 10px;
  font-family: 'Times New Roman', '宋体', serif;
  font-size: 12pt;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;
}
.ref-textarea:focus { outline: none; border-color: #1a73e8; }
.btn-add {
  padding: 6px 16px;
  border: 1px solid #1a73e8;
  border-radius: 4px;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 2px;
}
.btn-add:hover { background: #1557b0; }
.ref-hint { margin: 4px 0 0; font-size: 11px; color: #aaa; }
.ref-list { margin-top: 12px; display: flex; flex-direction: column; gap: 4px; }
.ref-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 12pt; line-height: 1.6; }
.ref-index { font-weight: 600; color: #1a73e8; flex-shrink: 0; min-width: 2em; }
.ref-text { flex: 1; word-break: break-all; }
.ref-remove { border: none; background: none; color: #d32f2f; cursor: pointer; font-size: 18px; flex-shrink: 0; padding: 0 4px; }
.ref-remove:hover { color: #b71c1c; }
.ref-empty { color: #999; font-size: 13px; padding: 20px 0; text-align: center; }
</style>
