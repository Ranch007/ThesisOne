import type { ThesisAST } from '@/types/ast'
import type { ReferenceItem, FormatIssue } from '@/types'
import { checkHeadingHierarchy } from './heading-check'
import { checkFigureTableSequence } from './figure-table-check'
import { checkCitationConsistency } from './reference-check'
import { checkFontCompliance } from './font-check'

export { checkHeadingHierarchy, checkFigureTableSequence, checkCitationConsistency, checkFontCompliance }

/** 全量格式检测 */
export function validateFormat(
  ast: ThesisAST,
  references: ReferenceItem[],
): FormatIssue[] {
  return [
    ...checkHeadingHierarchy(ast),
    ...checkFigureTableSequence(ast.body),
    ...checkCitationConsistency(ast, references),
    ...checkFontCompliance(ast),
  ]
}
