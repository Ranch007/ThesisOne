/** 封面信息 */
export interface CoverInfo {
  university: string
  college: string
  major: string
  thesisTitle: string
  studentName: string
  studentId: string
  advisor: string
  submissionDate: string
}

/** 封底信息 */
export interface BackCoverInfo {
  declarationText: string
  hasSignature: boolean
}
