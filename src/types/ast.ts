/** AST 节点类型枚举 */
export enum NodeType {
  THESIS_TITLE = 'THESIS_TITLE',
  AUTHOR_INFO = 'AUTHOR_INFO',
  ABSTRACT_ZH_TITLE = 'ABSTRACT_ZH_TITLE',
  ABSTRACT_ZH_CONTENT = 'ABSTRACT_ZH_CONTENT',
  KEYWORDS_ZH = 'KEYWORDS_ZH',
  ABSTRACT_EN_TITLE = 'ABSTRACT_EN_TITLE',
  ABSTRACT_EN_CONTENT = 'ABSTRACT_EN_CONTENT',
  KEYWORDS_EN = 'KEYWORDS_EN',
  TOC_TITLE = 'TOC_TITLE',
  TOC_ITEM = 'TOC_ITEM',
  HEADING_1 = 'HEADING_1',
  HEADING_2 = 'HEADING_2',
  HEADING_3 = 'HEADING_3',
  PARAGRAPH = 'PARAGRAPH',
  FIGURE_CAPTION = 'FIGURE_CAPTION',
  TABLE_CAPTION = 'TABLE_CAPTION',
  FORMULA = 'FORMULA',
  REF_TITLE = 'REF_TITLE',
  REF_ITEM = 'REF_ITEM',
  ACK_TITLE = 'ACK_TITLE',
  ACK_CONTENT = 'ACK_CONTENT',
  APPENDIX_TITLE = 'APPENDIX_TITLE',
  APPENDIX_CONTENT = 'APPENDIX_CONTENT',
  PAGE_BREAK = 'PAGE_BREAK',
}

/** 学科标题体系 */
export enum Discipline {
  SOCIAL_SCIENCE = 'SOCIAL_SCIENCE',
  SCIENCE_ENGINEERING = 'SCIENCE_ENGINEERING',
}

/** AST 节点 */
export interface DocumentNode {
  id: string
  type: NodeType
  text: string
  lineNumber: number
  /** 标题层级（仅 HEADING_1/2/3 有效） */
  level?: 1 | 2 | 3
  /** 章节编号（仅 FIGURE_CAPTION/TABLE_CAPTION/FORMULA 有效） */
  chapterNumber?: number
  /** 图/表/公式序号（仅 FIGURE_CAPTION/TABLE_CAPTION/FORMULA 有效） */
  itemNumber?: number
}

/** 论文 AST 三段结构 */
export interface ThesisAST {
  frontMatter: {
    title: DocumentNode | null
    authorInfo: DocumentNode | null
    abstractZh: DocumentNode[]
    abstractEn: DocumentNode[]
    toc: DocumentNode[]
  }
  body: DocumentNode[]
  backMatter: {
    references: DocumentNode[]
    acknowledgement: DocumentNode[]
    appendices: DocumentNode[]
  }
}

/** 分词 Token */
export interface Token {
  id: string
  text: string
  lineNumber: number
  isEmpty: boolean
  indent: number
  startsWithNumber: boolean
  startsWithChineseNumber: boolean
}
