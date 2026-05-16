import {
  Document,
  SectionType,
  Paragraph,
  TextRun,
  type ISectionOptions,
} from 'docx'
import { NodeType } from '@/types/ast'
import type { ThesisAST, DocumentConfig, ReferenceItem } from '@/types'
import { FONT_FAMILY, FONT_SIZE } from '@/constants/jhu'
import {
  createBodyParagraph,
  createHeadingParagraph,
  createCaption,
  createCenteredText,
  createMargins,
} from './style-factory'
import { buildTOC } from './toc-builder'
import { buildReferenceList } from './reference-builder'

export interface BuildOptions {
  ast: ThesisAST
  config: DocumentConfig
  references?: ReferenceItem[]
}

/** AST → OOXML Document */
export function buildDocument(options: BuildOptions): Document {
  const { ast, config, references } = options
  const margins = createMargins(config)
  const sections: ISectionOptions[] = []

  // ── 第 1 节：中文摘要（有内容时才生成） ─────────────
  const hasZhAbstract = ast.frontMatter.abstractZh.length > 0
  if (hasZhAbstract) {
    const zhChildren: Paragraph[] = []
    for (const node of ast.frontMatter.abstractZh) {
      if (node.type === NodeType.ABSTRACT_ZH_TITLE) {
        zhChildren.push(createCenteredText(node.text, FONT_FAMILY.chineseHei, FONT_SIZE.san, config.westernFont, true))
      } else {
        zhChildren.push(createBodyParagraph(node.text, config))
      }
    }
    sections.push({
      properties: { type: SectionType.NEXT_PAGE, page: { margin: margins } },
      children: zhChildren,
    })
  }

  // ── 第 3 节：英文摘要（有内容时才生成） ─────────────
  const hasEnAbstract = ast.frontMatter.abstractEn.length > 0
  if (hasEnAbstract) {
    const enChildren: Paragraph[] = []
    for (const node of ast.frontMatter.abstractEn) {
      if (node.type === NodeType.ABSTRACT_EN_TITLE) {
        enChildren.push(createCenteredText(node.text, FONT_FAMILY.western, FONT_SIZE.san, config.westernFont, true))
      } else {
        enChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: node.text,
                font: { ascii: config.westernFont, hAnsi: config.westernFont },
                size: FONT_SIZE.xiaoSi,
              }),
            ],
          }),
        )
      }
    }
    sections.push({
      properties: { type: SectionType.NEXT_PAGE, page: { margin: margins } },
      children: enChildren,
    })
  }

  // ── 第 3 节：目录 ───────────────────────────────────
  const headings = ast.body.filter(
    (n) =>
      n.type === NodeType.HEADING_1 ||
      n.type === NodeType.HEADING_2 ||
      n.type === NodeType.HEADING_3,
  )
  sections.push({
    properties: { type: SectionType.NEXT_PAGE, page: { margin: margins } },
    children: [
      createCenteredText('目  录', FONT_FAMILY.chineseHei, FONT_SIZE.san, config.westernFont, true),
      ...buildTOC(headings, config, hasZhAbstract, hasEnAbstract),
    ],
  })

  // ── 第 4 节：正文 ───────────────────────────────────
  const bodyChildren: Paragraph[] = []
  for (const node of ast.body) {
    switch (node.type) {
      case NodeType.HEADING_1:
        bodyChildren.push(createHeadingParagraph(node.text, 1, config))
        break
      case NodeType.HEADING_2:
        bodyChildren.push(createHeadingParagraph(node.text, 2, config))
        break
      case NodeType.HEADING_3:
        bodyChildren.push(createHeadingParagraph(node.text, 3, config))
        break
      case NodeType.FIGURE_CAPTION:
      case NodeType.TABLE_CAPTION:
        bodyChildren.push(createCaption(node.text, config))
        break
      case NodeType.FORMULA:
        bodyChildren.push(
          new Paragraph({
            alignment: 'center',
            children: [new TextRun({ text: node.text, size: FONT_SIZE.xiaoSi })],
          }),
        )
        break
      default:
        bodyChildren.push(createBodyParagraph(node.text, config))
    }
  }
  sections.push({
    properties: {
      type: SectionType.NEXT_PAGE,
      page: {
        margin: margins,
        pageNumbers: { start: config.pageNumber.bodyStartPage },
      },
    },
    children: bodyChildren,
  })

  // ── 第 5 节：参考文献 ───────────────────────────────
  if (ast.backMatter.references.length > 0) {
    const refList = references ?? []
    sections.push({
      properties: { type: SectionType.NEXT_PAGE, page: { margin: margins } },
      children: [
        createCenteredText('参考文献', FONT_FAMILY.chineseHei, FONT_SIZE.si, config.westernFont, true),
        ...buildReferenceList(refList, config),
      ],
    })
  }

  // ── 第 6 节：致谢 ───────────────────────────────────
  if (ast.backMatter.acknowledgement.length > 0) {
    const ackChildren: Paragraph[] = []
    for (const node of ast.backMatter.acknowledgement) {
      if (node.type === NodeType.ACK_TITLE) {
        ackChildren.push(
          createCenteredText(node.text, FONT_FAMILY.chineseHei, FONT_SIZE.si, config.westernFont, true),
        )
      } else {
        ackChildren.push(createBodyParagraph(node.text, config))
      }
    }
    sections.push({
      properties: { type: SectionType.NEXT_PAGE, page: { margin: margins } },
      children: ackChildren,
    })
  }

  // ── 第 7 节：附录 ───────────────────────────────────
  if (ast.backMatter.appendices.length > 0) {
    const appChildren: Paragraph[] = []
    for (const node of ast.backMatter.appendices) {
      if (node.type === NodeType.APPENDIX_TITLE) {
        appChildren.push(createHeadingParagraph(node.text, 1, config))
      } else {
        appChildren.push(createBodyParagraph(node.text, config))
      }
    }
    sections.push({
      properties: { type: SectionType.NEXT_PAGE, page: { margin: margins } },
      children: appChildren,
    })
  }

  return new Document({ sections })
}
