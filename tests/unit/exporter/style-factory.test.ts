import { describe, it, expect } from 'vitest'
import {
  createBodyParagraph,
  createHeadingParagraph,
  createCenteredText,
  createCaption,
} from '@/exporter/style-factory'
import { DEFAULT_CONFIG } from '@/constants/defaults'
import { Paragraph } from 'docx'

describe('createBodyParagraph', () => {
  it('should return a Paragraph', () => {
    const p = createBodyParagraph('测试正文段落', DEFAULT_CONFIG)
    expect(p).toBeInstanceOf(Paragraph)
  })
})

describe('createHeadingParagraph', () => {
  it('should return a Paragraph for level 1', () => {
    const p = createHeadingParagraph('一、绪论', 1, DEFAULT_CONFIG)
    expect(p).toBeInstanceOf(Paragraph)
  })

  it('should return a Paragraph for level 2', () => {
    const p = createHeadingParagraph('（一）研究背景', 2, DEFAULT_CONFIG)
    expect(p).toBeInstanceOf(Paragraph)
  })
})

describe('createCenteredText', () => {
  it('should return a centered Paragraph', () => {
    const p = createCenteredText('论文题目', '黑体', 36, 'Times New Roman', true)
    expect(p).toBeInstanceOf(Paragraph)
  })
})

describe('createCaption', () => {
  it('should return a caption Paragraph', () => {
    const p = createCaption('图1-1 系统架构图', DEFAULT_CONFIG)
    expect(p).toBeInstanceOf(Paragraph)
  })
})
