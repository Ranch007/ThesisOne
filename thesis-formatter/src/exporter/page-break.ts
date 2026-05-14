import { PageBreak } from 'docx'

/** 分页符 */
export function pageBreak(): PageBreak {
  return new PageBreak()
}

/** 添加 N 个分页符 */
export function pageBreaks(count: number): PageBreak[] {
  return Array.from({ length: count }, () => new PageBreak())
}

/** 判断节点是否触发另起一页 */
export function needsPageBreak(nodeType: string): boolean {
  return [
    'ACK_TITLE',
    'APPENDIX_TITLE',
    'REF_TITLE',
  ].includes(nodeType)
}
