import { Paragraph } from 'docx'
import type { CoverInfo, DocumentConfig } from '@/types'
import { FONT_FAMILY, FONT_SIZE } from '@/constants/jhu'
import { createCenteredText } from './style-factory'

/** 构建封面页段落列表 */
export function buildCover(cover: CoverInfo, config: DocumentConfig): Paragraph[] {
  const wf = config.westernFont
  const gap = new Paragraph({ spacing: { after: 400 } })

  return [
    createCenteredText(cover.university, FONT_FAMILY.chineseHei, FONT_SIZE.san, wf, true),
    gap,
    createCenteredText('本科毕业论文（设计）', FONT_FAMILY.chineseHei, FONT_SIZE.san, wf, true),
    new Paragraph({ spacing: { after: 600 } }),
    createCenteredText(cover.thesisTitle, FONT_FAMILY.chineseHei, FONT_SIZE.xiaoEr, wf, true),
    new Paragraph({ spacing: { after: 200 } }),
    createCenteredText(`学    院：${cover.college}`, FONT_FAMILY.chineseSong, FONT_SIZE.xiaoSi, wf),
    createCenteredText(`专    业：${cover.major}`, FONT_FAMILY.chineseSong, FONT_SIZE.xiaoSi, wf),
    createCenteredText(`学    号：${cover.studentId}`, FONT_FAMILY.chineseSong, FONT_SIZE.xiaoSi, wf),
    createCenteredText(`学生姓名：${cover.studentName}`, FONT_FAMILY.chineseSong, FONT_SIZE.xiaoSi, wf),
    createCenteredText(`指导教师：${cover.advisor}`, FONT_FAMILY.chineseSong, FONT_SIZE.xiaoSi, wf),
    createCenteredText(`提交日期：${cover.submissionDate}`, FONT_FAMILY.chineseSong, FONT_SIZE.xiaoSi, wf),
  ]
}
