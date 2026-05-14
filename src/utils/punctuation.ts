/**
 * 中文语境标点统一
 *
 * 将半角标点符号转换为全角，确保中文排版规范。
 */

/** 半角 → 全角映射 */
const HALF_TO_FULL: Record<string, string> = {
  ',': '，',
  '.': '。',
  ';': '；',
  ':': '：',
  '!': '！',
  '?': '？',
  '(': '（',
  ')': '）',
  '[': '【',
  ']': '】',
  '<': '《',
  '>': '》',
}

/** 将中文语境下的半角标点转为全角 */
export function normalizePunctuation(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      // 仅在包含中文字符的行执行转换
      if (/[一-鿿]/.test(line)) {
        return line.replace(/[,.;:!?()\[\]<>]/g, (ch) => HALF_TO_FULL[ch] ?? ch)
      }
      return line
    })
    .join('\n')
}

/** 在中文字符与西文/数字之间插入微小间距 */
export function insertCJKSpace(text: string): string {
  return text.replace(
    /([一-鿿])([a-zA-Z0-9])/g,
    '$1 $2',
  ).replace(
    /([a-zA-Z0-9])([一-鿿])/g,
    '$1 $2',
  )
}
