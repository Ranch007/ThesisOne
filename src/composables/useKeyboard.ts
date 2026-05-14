import { onMounted, onUnmounted } from 'vue'

type KeyHandler = (e: KeyboardEvent) => void

interface KeyBinding {
  key: string
  ctrl?: boolean
  handler: KeyHandler
}

/** 键盘快捷键 */
export function useKeyboard(bindings: KeyBinding[]) {
  function onKeyDown(e: KeyboardEvent) {
    for (const b of bindings) {
      const keyMatch = e.key === b.key
      const ctrlMatch = b.ctrl ? (e.ctrlKey || e.metaKey) : true
      if (keyMatch && ctrlMatch) {
        e.preventDefault()
        b.handler(e)
        return
      }
    }
  }

  onMounted(() => document.addEventListener('keydown', onKeyDown))
  onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
}
