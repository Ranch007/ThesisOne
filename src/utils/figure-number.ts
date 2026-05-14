/**
 * 图表编号解析与重排
 *
 * 编号格式：图X-Y / 表X-Y（X = 章节号，Y = 序号）
 */

/** 编号解析结果 */
export interface FigureNumber {
  chapter: number
  item: number
}

/** 匹配 "图1-1" / "图 1-1" / "表2-3" / "表 2-3" */
const FIGURE_TABLE_RE = /^(图|表)\s*(\d+)\s*[-.]\s*(\d+)/

/** 匹配公式编号 "(1-1)" 或 "（1-1）"（行中任意位置，兼容半角/全角括号） */
const FORMULA_RE = /[（(](\d+)\s*[-.]\s*(\d+)[）)]/

/** 解析图/表编号 */
export function parseFigureNumber(text: string): FigureNumber | null {
  const m = text.match(FIGURE_TABLE_RE)
  if (!m) return null
  return { chapter: parseInt(m[2]), item: parseInt(m[3]) }
}

/** 解析公式编号 */
export function parseFormulaNumber(text: string): FigureNumber | null {
  const m = text.match(FORMULA_RE)
  if (!m) return null
  return { chapter: parseInt(m[1]), item: parseInt(m[2]) }
}

/** 按章节重新编号：给定同一章节下的项列表，返回连续编号 → 新编号的映射 */
export function renumberSequence(items: { oldChapter: number; oldItem: number }[]): Map<string, string> {
  const map = new Map<string, string>()
  let counter = 1
  for (const item of items) {
    const oldKey = `${item.oldChapter}-${item.oldItem}`
    const newKey = `${item.oldChapter}-${counter}`
    map.set(oldKey, newKey)
    counter++
  }
  return map
}
