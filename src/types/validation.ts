/** 格式问题 */
export interface FormatIssue {
  id: string
  severity: 'error' | 'warning'
  type: 'heading_skip' | 'figure_gap' | 'citation_mismatch' | 'font_mismatch' | 'reference_count'
  message: string
  location: {
    lineNumber: number
    nodeId: string
  }
}
