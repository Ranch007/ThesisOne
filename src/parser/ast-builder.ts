import { NodeType, Discipline } from '@/types/ast'
import type { ThesisAST, DocumentNode, Token } from '@/types/ast'
import type { SectionKey } from '@/types/editor'
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
import { matchMarkdownHeading, stripMarkdownInline } from './matchers/markdown'

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

// ═══════════════════════════════════════════════════════════════
// 分章节解析（新增：编辑器 7 段独立输入）
// ═══════════════════════════════════════════════════════════════

/**
 * 分章节解析 —— 每个章节独立解析，不再依赖状态机识别边界
 */
export function parseSections(
  sections: Record<SectionKey, string>,
  options: ParseOptions = {},
): ThesisAST {
  const discipline = options.discipline ?? Discipline.SOCIAL_SCIENCE
  const ast = emptyAST()

  // 中文摘要
  if (sections.abstractZh.trim()) {
    parseAbstractText(sections.abstractZh, 'zh', ast)
  }

  // 英文摘要
  if (sections.abstractEn.trim()) {
    parseAbstractText(sections.abstractEn, 'en', ast)
  }

  // 正文
  if (sections.body.trim()) {
    const tokens = tokenize(sections.body)
    ast.body.push(...parseBodyContent(tokens, discipline, options.isMarkdown))
  }

  // 致谢
  if (sections.acknowledgement.trim()) {
    parseBackSection(sections.acknowledgement, 'ack', ast)
  }

  // 附录
  if (sections.appendix.trim()) {
    parseBackSection(sections.appendix, 'appendix', ast)
  }

  // 正文有标题时自动生成目录标题
  if (ast.body.some((n) => n.type.startsWith('HEADING_'))) {
    ast.frontMatter.toc.push({
      id: uid(),
      type: NodeType.TOC_TITLE,
      text: '目  录',
      lineNumber: 1,
    })
  }

  return ast
}

/** 解析摘要文本（中文/英文） */
function parseAbstractText(text: string, lang: 'zh' | 'en', ast: ThesisAST) {
  const tokens = tokenize(text)
  if (tokens.length === 0) return

  const target = lang === 'zh' ? ast.frontMatter.abstractZh : ast.frontMatter.abstractEn
  let i = 0

  // 跳过空行
  while (i < tokens.length && tokens[i].isEmpty) i++

  // 首行作为摘要标题
  if (i < tokens.length) {
    const first = tokens[i]
    const type = lang === 'zh' ? NodeType.ABSTRACT_ZH_TITLE : NodeType.ABSTRACT_EN_TITLE
    target.push({
      id: uid(),
      type,
      text: first.text.trim(),
      lineNumber: first.lineNumber,
    })
    i++
  }

  // 剩余行中，检测关键词行，其余为摘要正文
  for (let j = i; j < tokens.length; j++) {
    const token = tokens[j]
    if (token.isEmpty) continue
    const t = token.text.trim()

    if (lang === 'zh') {
      const kw = matchKeywordsZh([token], 0)
      if (kw) { target.push(kw); break }
    } else {
      const kw = matchKeywordsEn([token], 0)
      if (kw) { target.push(kw); break }
    }

    target.push({
      id: uid(),
      type: lang === 'zh' ? NodeType.ABSTRACT_ZH_CONTENT : NodeType.ABSTRACT_EN_CONTENT,
      text: t,
      lineNumber: token.lineNumber,
    })
  }
}

/** 解析后置章节（致谢/附录） */
function parseBackSection(text: string, kind: 'ack' | 'appendix', ast: ThesisAST) {
  const tokens = tokenize(text)
  if (tokens.length === 0) return

  const target = kind === 'ack' ? ast.backMatter.acknowledgement : ast.backMatter.appendices
  let i = 0
  while (i < tokens.length && tokens[i].isEmpty) i++
  if (i >= tokens.length) return

  const firstToken = tokens[i]

  // 检测首行是否匹配章节标题
  let hasTitle = false
  if (kind === 'ack') {
    const ackTitle = matchAckTitle(firstToken)
    if (ackTitle) { target.push(ackTitle); hasTitle = true; i++ }
  } else {
    const appTitle = matchAppendixTitle(firstToken)
    if (appTitle) { target.push(appTitle); hasTitle = true; i++ }
  }

  // 无标题则自动补
  if (!hasTitle) {
    target.push({
      id: uid(),
      type: kind === 'ack' ? NodeType.ACK_TITLE : NodeType.APPENDIX_TITLE,
      text: kind === 'ack' ? '致谢' : '附录',
      lineNumber: firstToken.lineNumber,
    })
  }

  // 剩余行作内容
  for (let j = i; j < tokens.length; j++) {
    const token = tokens[j]
    if (token.isEmpty) continue
    target.push({
      id: uid(),
      type: kind === 'ack' ? NodeType.ACK_CONTENT : NodeType.APPENDIX_CONTENT,
      text: token.text.trim(),
      lineNumber: token.lineNumber,
    })
  }
}

/**
 * 解析正文内容（标题 + 段落 + 图表 + 公式）
 *
 * 从原 parseThesis() 中提取，删除了全局模式切换逻辑
 * （REFERENCES / ACK / APPENDIX 检测），仅保留纯正文匹配。
 */
function parseBodyContent(
  tokens: Token[],
  discipline: Discipline,
  isMarkdown?: boolean,
): DocumentNode[] {
  const result: DocumentNode[] = []
  let currentChapter = 0

  for (let j = 0; j < tokens.length; j++) {
    const token = tokens[j]
    if (token.isEmpty) continue

    const text = token.text.trim()

    // 1. 一级标题
    const h1 = matchHeading1(token, discipline)
    if (h1) {
      currentChapter = extractChapterNumber(text)
      result.push(h1)
      continue
    }

    // 2. 三级标题（在二级之前，防止贪婪匹配）
    const h3 = matchHeading3(token, discipline)
    if (h3) {
      result.push(h3)
      continue
    }

    // 3. 二级标题
    const h2 = matchHeading2(token, discipline)
    if (h2) {
      result.push(h2)
      continue
    }

    // 4. Markdown 标题（仅 Markdown 模式）
    if (isMarkdown) {
      const mdHeading = matchMarkdownHeading(token)
      if (mdHeading) {
        if (mdHeading.level === 1) {
          currentChapter = extractChapterNumber(mdHeading.text)
        }
        result.push(mdHeading)
        continue
      }
    }

    // 5. 图题
    const figure = matchFigure(token, currentChapter)
    if (figure) { result.push(figure); continue }

    // 6. 表题
    const table = matchTable(token, currentChapter)
    if (table) { result.push(table); continue }

    // 7. 公式
    const formula = matchFormula(token, currentChapter)
    if (formula) { result.push(formula); continue }

    // 8. 默认 → 正文段落
    result.push({
      id: uid(),
      type: NodeType.PARAGRAPH,
      text: isMarkdown ? stripMarkdownInline(text) : text,
      lineNumber: token.lineNumber,
    })
  }

  return result
}

// ═══════════════════════════════════════════════════════════════
// 全文解析（保留用于文件导入兼容）
// ═══════════════════════════════════════════════════════════════

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
      while (i < tokens.length && mode === ParseMode.TOC) {
        const next = tokens[i]
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

    // 6. 三级标题（h3 必须在 h2 之前，防止 h2 贪婪匹配多级编号）
    const h3 = matchHeading3(token, discipline)
    if (h3) {
      ast.body.push(h3)
      continue
    }

    // 7. 二级标题
    const h2 = matchHeading2(token, discipline)
    if (h2) {
      ast.body.push(h2)
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
      text: options.isMarkdown ? stripMarkdownInline(text) : text,
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
