import type { PiniaPluginContext } from 'pinia'

/**
 * Pinia 持久化插件
 *
 * 所有 Store 自动同步到 localStorage，500ms 防抖。
 * JSON 解析/写入失败静默处理。
 */
export function persistencePlugin({ store }: PiniaPluginContext): void {
  const key = `thesis:${store.$id}`

  // 初始化时恢复持久化数据
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      store.$patch(JSON.parse(saved))
    }
  } catch {
    // 数据损坏，忽略
  }

  // 变更时保存（防抖 500ms）
  let timer: ReturnType<typeof setTimeout>
  store.$subscribe(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(store.$state))
      } catch {
        // 空间不足，静默处理
      }
    }, 500)
  })
}
