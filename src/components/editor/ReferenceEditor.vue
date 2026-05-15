<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReferencesStore } from '@/stores/references'
import { ReferenceType } from '@/types/reference'
import type { ReferenceItem } from '@/types/reference'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'
import { formatGB7714 } from '@/references/gbt7714'

const refStore = useReferencesStore()
const toast = useToast()
const { items } = storeToRefs(refStore)

const showForm = ref(false)
const formErrors = ref<string[]>([])

// GB/T 7714 实时预览
const formattedPreview = computed(() => {
  const authors = form.value.authors.split(/[,，、]/).map((s) => s.trim()).filter(Boolean)
  if (!form.value.title || authors.length === 0) return ''
  const temp: ReferenceItem = {
    id: '',
    index: 0,
    type: form.value.type,
    authors,
    title: form.value.title,
    year: form.value.year,
    journal: form.value.journal || undefined,
    volume: form.value.volume || undefined,
    issue: form.value.issue || undefined,
    pages: form.value.pages || undefined,
    publisher: form.value.publisher || undefined,
    address: form.value.address || undefined,
    doi: form.value.doi || undefined,
  }
  return formatGB7714(temp)
})
const form = ref({
  type: ReferenceType.JOURNAL,
  authors: '',
  title: '',
  year: new Date().getFullYear(),
  journal: '',
  volume: '',
  issue: '',
  pages: '',
  publisher: '',
  address: '',
  doi: '',
})

function addReference() {
  formErrors.value = []
  const authors = form.value.authors.split(/[,，、]/).map((s) => s.trim()).filter(Boolean)

  if (!form.value.title.trim()) {
    formErrors.value.push('标题不能为空')
  }
  if (authors.length === 0) {
    formErrors.value.push('作者不能为空')
  }
  if (!form.value.year || form.value.year < 1900 || form.value.year > 2100) {
    formErrors.value.push('年份不合法')
  }

  if (formErrors.value.length > 0) {
    toast.show(formErrors.value[0], 'error')
    return
  }

  refStore.addRef({
    type: form.value.type,
    authors,
    title: form.value.title.trim(),
    year: form.value.year,
    ...(form.value.journal ? { journal: form.value.journal } : {}),
    ...(form.value.volume ? { volume: form.value.volume } : {}),
    ...(form.value.issue ? { issue: form.value.issue } : {}),
    ...(form.value.pages ? { pages: form.value.pages } : {}),
    ...(form.value.publisher ? { publisher: form.value.publisher } : {}),
    ...(form.value.address ? { address: form.value.address } : {}),
    ...(form.value.doi ? { doi: form.value.doi } : {}),
  })

  toast.show(`已添加文献 [${items.value.length + 1}]`, 'success')
  form.value = { ...form.value, authors: '', title: '', journal: '', volume: '', issue: '', pages: '', publisher: '', address: '', doi: '' }
  showForm.value = false
}
</script>

<template>
  <div class="ref-editor">
    <div class="ref-header">
      <span>{{ items.length }} 条文献</span>
      <button class="btn-add" @click="showForm = !showForm">
        {{ showForm ? '取消' : '+ 添加文献' }}
      </button>
    </div>

    <div v-if="showForm" class="ref-form">
      <select v-model="form.type">
        <option v-for="t in Object.values(ReferenceType)" :key="t" :value="t">{{ t }}</option>
      </select>
      <input v-model="form.authors" placeholder="作者（逗号分隔）" />
      <input v-model="form.title" placeholder="标题" />
      <input v-model.number="form.year" type="number" placeholder="年份" />
      <input v-if="form.type === ReferenceType.JOURNAL" v-model="form.journal" placeholder="期刊名" />
      <input v-if="form.type === ReferenceType.JOURNAL" v-model="form.volume" placeholder="卷号" />
      <input v-if="form.type === ReferenceType.JOURNAL" v-model="form.issue" placeholder="期号" />
      <input v-if="form.type === ReferenceType.JOURNAL" v-model="form.pages" placeholder="页码" />
      <input v-if="form.type === ReferenceType.BOOK" v-model="form.publisher" placeholder="出版社" />
      <input v-if="form.type === ReferenceType.BOOK" v-model="form.address" placeholder="出版地" />
      <input v-model="form.doi" placeholder="DOI（可选）" />
      <button class="btn-save" @click="addReference">保存</button>
      <div v-if="formattedPreview" class="ref-preview">
        <span class="preview-label">GB/T 7714 预览：</span>
        {{ formattedPreview }}
      </div>
    </div>

    <div class="ref-list">
      <div v-for="item in items" :key="item.id" class="ref-item">
        <span class="ref-index">[{{ item.index }}]</span>
        <span class="ref-text">{{ item.authors.join(', ') }}. {{ item.title }} ({{ item.year }})</span>
        <button class="ref-remove" @click="refStore.removeRef(item.id)">×</button>
      </div>
      <div v-if="items.length === 0" class="ref-empty">暂未添加参考文献</div>
    </div>
  </div>
</template>

<style scoped>
.ref-editor { padding: 12px; height: 100%; overflow-y: auto; }
.ref-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; }
.btn-add { padding: 4px 12px; border: 1px solid #1a73e8; border-radius: 4px; background: #e8f0fe; color: #1a73e8; cursor: pointer; font-size: 13px; }
.ref-form { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; padding: 12px; background: #f8f8f8; border-radius: 4px; }
.ref-form input, .ref-form select { padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; }
.btn-save { padding: 6px; border: none; border-radius: 4px; background: #1a73e8; color: #fff; cursor: pointer; }
.ref-preview { padding: 8px 10px; background: #f0f7ff; border-radius: 4px; font-size: 12px; color: #555; line-height: 1.5; word-break: break-all; }
.preview-label { font-weight: 500; color: #1a73e8; }
.ref-list { display: flex; flex-direction: column; gap: 4px; }
.ref-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
.ref-index { font-weight: 500; color: #1a73e8; flex-shrink: 0; }
.ref-text { flex: 1; }
.ref-remove { border: none; background: none; color: #d32f2f; cursor: pointer; font-size: 16px; flex-shrink: 0; }
.ref-empty { color: #999; font-size: 13px; padding: 20px 0; text-align: center; }
</style>
