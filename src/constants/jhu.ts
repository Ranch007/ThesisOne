/**
 * 江汉大学本科毕业论文（设计）规范化要求 — 排版常量
 *
 * 单位说明：
 *   twip = 1/20 pt = 1/1440 inch
 *   half-point = 1/2 pt（OOXML 字号单位）
 *   1 cm ≈ 567 twip
 */

// ─── 页面尺寸 ───────────────────────────────────────────

/** A4 纸张（twip）：210mm × 297mm */
export const PAGE_WIDTH_TWIP = 11906
export const PAGE_HEIGHT_TWIP = 16838

/** 默认页边距（cm） */
export const DEFAULT_MARGINS = {
  top: 2.54,
  bottom: 2.54,
  left: 3.0,
  right: 2.0,
} as const

// ─── 字体名称 ───────────────────────────────────────────

export const FONT_FAMILY = {
  chineseSong: '宋体',
  chineseHei: '黑体',
  western: 'Times New Roman',
} as const

// ─── 字号（half-point）──────────────────────────────────

export const FONT_SIZE = {
  xiaoEr: 36,   // 小2号 = 18pt（论文题目）
  san: 32,       // 3号 = 16pt（一级标题、摘要题头、目录题头）
  si: 28,        // 4号 = 14pt（二级标题、参考文献标题、致谢标题、附录标题）
  xiaoSi: 24,   // 小4号 = 12pt（正文、三级标题、署名、摘要内容、目录内容）
  wu: 21,        // 5号 = 10.5pt（图题/表题、表内文字、参考文献条目、页码）
} as const

// ─── 行距（twip）────────────────────────────────────────

/** 固定行距 22 磅 = 440 twip */
export const LINE_SPACING_TWIP = 440

// ─── 缩进（twip）────────────────────────────────────────

/** 1 字符 ≈ 240 twip */
export const CHAR_WIDTH_TWIP = 240

/** 2 字符缩进 */
export const INDENT_2_CHARS = 480

// ─── 标题规则 ───────────────────────────────────────────

/** 社科类标题正则 */
export const SOCIAL_SCIENCE_RULES = {
  heading1: /^[一二三四五六七八九十]+、/,
  heading2: /^（[一二三四五六七八九十]+）/, // eslint-disable-line
  /** 仅匹配单级数字编号（"1."），不匹配多级（"1.1"、"1.1.1"） */
  heading3: /^\d+\.(?![.\d])/,
} as const

/** 理工类标题正则 */
export const SCIENCE_ENGINEERING_RULES = {
  /** "1 XXXX" 或 "1. XXXX" */
  heading1: /^\d+(?:\.\s|\s)/,
  /** 仅匹配两级编号（"1.1"），不匹配三级（"1.1.1"） */
  heading2: /^\d+\.\d+(?![.\d])/,
  heading3: /^\d+\.\d+\.\d+/,
} as const

// ─── 页码 ───────────────────────────────────────────────

/** 距下边界 1.75cm */
export const PAGE_NUMBER_BOTTOM_CM = 1.75
