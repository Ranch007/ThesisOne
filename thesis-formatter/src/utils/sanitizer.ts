import { sanitizeText } from './text-sanitize'
import { normalizePunctuation } from './punctuation'

/**
 * 解析器文本净化流水线
 *
 * 调用 text-sanitize 的清洗 + punctuation 的标点统一，
 * 为后续分词/匹配提供干净输入。
 */
export function sanitize(rawText: string): string {
  let text = rawText
  text = sanitizeText(text)
  text = normalizePunctuation(text)
  return text
}
