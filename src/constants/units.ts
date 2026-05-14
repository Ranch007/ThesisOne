/** 单位转换工具（纯函数，无副作用） */

/** 厘米 → twip */
export function cmToTwip(cm: number): number {
  return Math.round(cm * 567)
}

/** twip → 厘米 */
export function twipToCm(twip: number): number {
  return twip / 567
}

/** pt → half-point（OOXML 字号单位） */
export function ptToHalfPoint(pt: number): number {
  return pt * 2
}

/** half-point → pt */
export function halfPointToPt(hp: number): number {
  return hp / 2
}

/** 磅值(pt) → twip */
export function ptToTwip(pt: number): number {
  return pt * 20
}

/** 厘米 → 像素（96dpi 屏幕渲染） */
export function cmToPx(cm: number): number {
  return cm * 37.795
}

/** 屏幕 px 对应 A4 比例因子（96dpi 下 1cm ≈ 37.8px） */
export const A4_WIDTH_PX = cmToPx(21)   // 794px
export const A4_HEIGHT_PX = cmToPx(29.7) // 1123px
