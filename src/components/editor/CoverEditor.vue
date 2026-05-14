<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

function updateCover(path: string, value: string) {
  configStore.updateConfig({
    cover: { ...config.value.cover, [path]: value },
  })
}
</script>

<template>
  <div class="cover-editor">
    <div class="cover-field">
      <label>学校名称</label>
      <input :value="config.cover.university" @input="updateCover('university', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="cover-field">
      <label>学院</label>
      <input :value="config.cover.college" @input="updateCover('college', ($event.target as HTMLInputElement).value)" placeholder="如：计算机科学与技术学院" />
    </div>
    <div class="cover-field">
      <label>专业</label>
      <input :value="config.cover.major" @input="updateCover('major', ($event.target as HTMLInputElement).value)" placeholder="如：计算机科学与技术" />
    </div>
    <div class="cover-field">
      <label>论文题目</label>
      <input :value="config.cover.thesisTitle" @input="updateCover('thesisTitle', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="cover-field">
      <label>学生姓名</label>
      <input :value="config.cover.studentName" @input="updateCover('studentName', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="cover-field">
      <label>学号</label>
      <input :value="config.cover.studentId" @input="updateCover('studentId', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="cover-field">
      <label>指导教师</label>
      <input :value="config.cover.advisor" @input="updateCover('advisor', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="cover-field">
      <label>提交日期</label>
      <input type="date" :value="config.cover.submissionDate" @input="updateCover('submissionDate', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="cover-hint">
      封面信息将在导出 DOCX 时使用。
    </div>
  </div>
</template>

<style scoped>
.cover-editor { padding: 16px; height: 100%; overflow-y: auto; }
.cover-field { margin-bottom: 12px; }
.cover-field label { display: block; font-size: 13px; color: #666; margin-bottom: 4px; }
.cover-field input { width: 100%; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
.cover-hint { color: #999; font-size: 12px; margin-top: 16px; }
</style>
