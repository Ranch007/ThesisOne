import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { DocumentConfig } from '@/types/config'
import { Discipline } from '@/types/ast'
import { DEFAULT_CONFIG } from '@/constants/defaults'

export const useConfigStore = defineStore('config', () => {
  const config = reactive<DocumentConfig>({ ...DEFAULT_CONFIG })

  function updateConfig(partial: Partial<DocumentConfig>) {
    Object.assign(config, partial)
  }

  function switchDiscipline(d: Discipline) {
    config.discipline = d
  }

  function resetToDefault() {
    Object.assign(config, DEFAULT_CONFIG)
  }

  function importPreset(preset: DocumentConfig) {
    Object.assign(config, preset)
  }

  return { config, updateConfig, switchDiscipline, resetToDefault, importPreset }
})
