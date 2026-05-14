import type { Token } from '@/types/ast'

/**
 * 将文本按行拆分为 Token 序列
 *
 * 注意：调用方应先用 sanitize() 净化文本后再传入。
 */
export function tokenize(text: string): Token[] {
  const lines = text.split('\n')
  return lines.map((line, i) => ({
    id: `tok-${i}`,
    text: line,
    lineNumber: i + 1,
    isEmpty: line.trim() === '',
    indent: line.length - line.trimStart().length,
    startsWithNumber: /^\d/.test(line.trim()),
    startsWithChineseNumber: /^[一二三四五六七八九十]/.test(line.trim()),
  }))
}
