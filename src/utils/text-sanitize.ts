/**
 * 文本净化工具
 *
 * 将用户输入的原始文本清洗为解析器可处理的标准格式。
 */

/** 合并连续空行（>2 空行合并为 1） */
export function mergeBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n')
}

/** 清理行内多余空白（保留行首缩进） */
export function cleanExtraSpaces(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trimEnd()
      return trimmed.replace(/[^\S\n]{2,}/g, ' ')
    })
    .join('\n')
}

/** 去除首尾空白行 */
export function trimBlankEdges(text: string): string {
  return text.replace(/^\n+/, '').replace(/\n+$/, '')
}

/** 完整净化流水线 */
export function sanitizeText(text: string): string {
  let result = text
  result = mergeBlankLines(result)
  result = cleanExtraSpaces(result)
  result = trimBlankEdges(result)
  return result
}
