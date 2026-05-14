import { NodeType, Discipline } from '@/types/ast'
import type { ThesisAST } from '@/types/ast'
import { uid } from '@/utils/uid'
import { tokenize } from './tokenizer'
import { detectDiscipline } from './discipline'
import { matchTitle } from './matchers/title'
import { matchAuthor } from './matchers/author'
import { matchAbstractZh, matchAbstractEn } from './matchers/abstract'
import { matchKeywordsZh, matchKeywordsEn } from './matchers/keywords'
import {
  matchHeading1,
  matchHeading2,
  matchHeading3,
} from './matchers/heading'
import { matchFigure } from './matchers/figure'
import { matchTable } from './matchers/table'
import { matchFormula } from './matchers/formula'
import { matchRefTitle, matchRefItem } from './matchers/reference'
import { matchTOC } from './matchers/toc'
import { matchAckTitle, collectAckContent } from './matchers/ack'
import { matchAppendixTitle, collectAppendixContent } from './matchers/appendix'
import { matchMarkdownHeading } from './matchers/markdown'

/**
 * 解析器状态枚举
 *
 * 上下文感知匹配：当前处于论文的哪个部分，影响匹配行为。
 */
enum ParseMode {
  FRONT,       // 前置部分（题目→摘要→关键词）
  TOC,         // 目录区域
  BODY,        // 正文（标题+段落+图表+公式）
  REFERENCES,  // 参考文献区域
  ACK,         // 致谢区域
  APPENDIX,    // 附录区域
}

/**
 * 解析参数
 */
export interface ParseOptions {
  /** 指定学科（可选，不指定则自动检测） */
  discipline?: Discipline
  /** 是否为 Markdown 输入 */
  isMarkdown?: boolean
}

/**
 * 空 AST 工厂
 */
function emptyAST(): ThesisAST {
  return {
    frontMatter: {
      title: null,
      authorInfo: null,
      abstractZh: [],
      abstractEn: [],
      toc: [],
    },
    body: [],
    backMatter: {
      references: [],
      acknowledgement: [],
      appendices: [],
    },
  }
}

/**
 * 全文解析 —— 用户文本 → ThesisAST
 *
 * 解析流水线：
 *   rawText → tokenize → detectDiscipline → match pipeline → build AST
 */
export function parseThesis(rawText: string, options: ParseOptions = {}): ThesisAST {
  const tokens = tokenize(rawText)
  if (tokens.length === 0) return emptyAST()

  const discipline = options.discipline ?? detectDiscipline(tokens)

  const ast = emptyAST()
  let mode: ParseMode = ParseMode.FRONT
  let currentChapter = 0
  let i = 0

  // ── 前置部分：题目 ──────────────────────────────────
  const titleNode = matchTitle(tokens)
  if (titleNode) {
    ast.frontMatter.title = titleNode
    i = tokens.findIndex((t) => t.lineNumber === titleNode.lineNumber) + 1
  }

  // ── 前置部分：署名 ──────────────────────────────────
  const authorNode = matchAuthor(tokens, i)
  if (authorNode) {
    ast.frontMatter.authorInfo = authorNode
    i = tokens.findIndex((t) => t.lineNumber === authorNode.lineNumber) + 1
  }

  // ── 前置部分：中文摘要 + 关键词 ─────────────────────
  const zhResult = matchAbstractZh(tokens, i)
  if (zhResult) {
    for (const node of zhResult.nodes) {
      ast.frontMatter.abstractZh.push(node)
    }
    i = zhResult.nextIndex
    const kwZh = matchKeywordsZh(tokens, i)
    if (kwZh) {
      ast.frontMatter.abstractZh.push(kwZh)
      i = tokens.findIndex((t) => t.lineNumber === kwZh.lineNumber) + 1
    }
  }

  // ── 前置部分：英文摘要 + 关键词 ─────────────────────
  const enResult = matchAbstractEn(tokens, i)
  if (enResult) {
    for (const node of enResult.nodes) {
      ast.frontMatter.abstractEn.push(node)
    }
    i = enResult.nextIndex
    const kwEn = matchKeywordsEn(tokens, i)
    if (kwEn) {
      ast.frontMatter.abstractEn.push(kwEn)
      i = tokens.findIndex((t) => t.lineNumber === kwEn.lineNumber) + 1
    }
  }

  // ── 目录区域 ────────────────────────────────────────
  while (i < tokens.length) {
    const t = tokens[i]
    if (t.isEmpty) { i++; continue }

    const tocNode = matchTOC(t)
    if (tocNode) {
      ast.frontMatter.toc.push(tocNode)
      mode = ParseMode.TOC
      i++
      // 跳过手动目录内容（系统自动生成）
      while (i < tokens.length && mode === ParseMode.TOC) {
        const next = tokens[i]
        // 遇到正文标题（一级标题）则退出目录模式
        if (matchHeading1(next, discipline)) {
          mode = ParseMode.BODY
          break
        }
        i++
      }
      continue
    }
    break
  }

  // ── 正文 + 后置章节 ─────────────────────────────────
  mode = ParseMode.BODY

  for (let j = i; j < tokens.length; j++) {
    const token = tokens[j]
    if (token.isEmpty) continue

    const text = token.text.trim()

    // 13 级优先级匹配（从高到低）

    // 1. 参考文献标题 → 切换模式
    const refTitle = matchRefTitle(token)
    if (refTitle) {
      mode = ParseMode.REFERENCES
      ast.backMatter.references.push(refTitle)
      continue
    }

    // 2. 致谢标题 → 切换模式
    const ackTitle = matchAckTitle(token)
    if (ackTitle) {
      mode = ParseMode.ACK
      ast.backMatter.acknowledgement.push(ackTitle)
      continue
    }

    // 3. 附录标题 → 切换模式
    const appTitle = matchAppendixTitle(token)
    if (appTitle) {
      mode = ParseMode.APPENDIX
      ast.backMatter.appendices.push(appTitle)
      continue
    }

    // 4. 目录标题（正文中偶遇）
    const tocNode = matchTOC(token)
    if (tocNode && mode === ParseMode.BODY) {
      ast.frontMatter.toc.push(tocNode)
      continue
    }

    // 区域内的内容收集
    if (mode === ParseMode.REFERENCES) {
      const refItem = matchRefItem(token)
      if (refItem) {
        ast.backMatter.references.push(refItem)
      }
      continue
    }

    if (mode === ParseMode.ACK) {
      const content = collectAckContent(tokens, j)
      ast.backMatter.acknowledgement.push(...content)
      j += content.length
      continue
    }

    if (mode === ParseMode.APPENDIX) {
      const content = collectAppendixContent(tokens, j + 1)
      ast.backMatter.appendices.push(...content)
      j += content.length
      continue
    }

    // 5. 一级标题
    const h1 = matchHeading1(token, discipline)
    if (h1) {
      currentChapter = extractChapterNumber(text)
      ast.body.push(h1)
      continue
    }

    // 6. 二级标题
    const h2 = matchHeading2(token, discipline)
    if (h2) {
      ast.body.push(h2)
      continue
    }

    // 7. 三级标题
    const h3 = matchHeading3(token, discipline)
    if (h3) {
      ast.body.push(h3)
      continue
    }

    // 8. Markdown 标题（仅 Markdown 模式）
    if (options.isMarkdown) {
      const mdHeading = matchMarkdownHeading(token)
      if (mdHeading) {
        if (mdHeading.level === 1) {
          currentChapter = extractChapterNumber(mdHeading.text)
        }
        ast.body.push(mdHeading)
        continue
      }
    }

    // 9. 图题
    const figure = matchFigure(token, currentChapter)
    if (figure) {
      ast.body.push(figure)
      continue
    }

    // 10. 表题
    const table = matchTable(token, currentChapter)
    if (table) {
      ast.body.push(table)
      continue
    }

    // 11. 公式
    const formula = matchFormula(token, currentChapter)
    if (formula) {
      ast.body.push(formula)
      continue
    }

    // 12. 默认 → 正文段落
    ast.body.push({
      id: uid(),
      type: NodeType.PARAGRAPH,
      text,
      lineNumber: token.lineNumber,
    })
  }

  return ast
}

/** 从标题文本中提取章节编号 */
function extractChapterNumber(text: string): number {
  const m = text.match(/^(\d+)/)
  return m ? parseInt(m[1]) : 0
}
