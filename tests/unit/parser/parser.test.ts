import { describe, it, expect } from 'vitest'
import { parseThesis } from '@/parser'
import { Discipline, NodeType } from '@/types/ast'

// ── 社科类测试用例 ─────────────────────────────────────

const SOCIAL_SAMPLE = `基于深度学习的图像识别研究

张三
学生：计算机科学与技术学院

中文摘要
本文研究了深度学习在图像识别领域的应用，提出了一种改进的卷积神经网络模型。
实验结果表明，该模型在多个基准数据集上取得了优异的识别精度。
关键词：深度学习；图像识别；卷积神经网络

一、绪论

随着人工智能技术的快速发展，深度学习在计算机视觉领域取得了突破性进展。
本章将介绍研究背景、研究目的和论文结构。

（一）研究背景

近年来，深度学习技术已经在图像分类、目标检测、语义分割等任务中取得了显著成果。

1. 国内外研究现状

国外学者在深度学习图像识别方面已经做了大量工作。
国内学者近年来也取得了一系列重要成果。

（二）研究意义

本研究对于推动深度学习在工业检测场景中的应用具有重要意义。

二、相关工作与理论基础

本章主要介绍卷积神经网络的基本原理和常用模型结构。

（一）卷积神经网络基础

CNN通过卷积层、池化层和全连接层的组合实现特征提取和分类。

图2-1 卷积神经网络结构示意图

（二）经典网络模型

ResNet通过残差连接解决了深层网络的梯度消失问题。
DenseNet通过密集连接进一步提升了特征复用效率。

表2-1 各模型在ImageNet上的性能对比

三、改进的CNN模型

本章提出一种基于注意力机制的改进卷积神经网络模型。

（一）模型架构设计

提出的模型在ResNet的基础上引入了通道注意力模块和空间注意力模块。

公式（3-1）：特征变换方程

（二）训练策略

采用数据增强、学习率预热和余弦退火等训练策略。

致谢

感谢导师的悉心指导和实验室同学的热情帮助。

参考文献
[1] 张三, 李四. 深度学习综述[J]. 计算机学报, 2020, 43(1): 1-20.
[2] 王五. 图像识别技术[M]. 北京: 科学出版社, 2019.
`

const SCIENCE_SAMPLE = `# 基于深度学习的图像识别研究

## 1 绪论

随着人工智能技术的快速发展，深度学习在计算机视觉领域取得了突破性进展。

### 1.1 研究背景

近年来，深度学习技术已经在图像分类、目标检测、语义分割等任务中取得了显著成果。

### 1.2 研究意义

本研究对于推动深度学习在工业检测场景中的应用具有重要意义。

## 2 相关工作与理论基础

本章主要介绍卷积神经网络的基本原理和常用模型结构。

### 2.1 卷积神经网络基础

CNN通过卷积层、池化层和全连接层的组合实现特征提取和分类。

图2-1 卷积神经网络结构示意图

### 2.2 经典网络模型

ResNet通过残差连接解决了深层网络的梯度消失问题。

表2-2 各模型在ImageNet上的性能对比
`

// ── 测试用例 ───────────────────────────────────────────

describe('parseThesis - 社科类', () => {
  const result = parseThesis(SOCIAL_SAMPLE, { discipline: Discipline.SOCIAL_SCIENCE })

  it('应解析论文题目', () => {
    expect(result.frontMatter.title).not.toBeNull()
    expect(result.frontMatter.title?.type).toBe(NodeType.THESIS_TITLE)
    expect(result.frontMatter.title?.text).toBe('基于深度学习的图像识别研究')
  })

  it('应解析署名信息', () => {
    expect(result.frontMatter.authorInfo).not.toBeNull()
    expect(result.frontMatter.authorInfo?.text).toContain('学生')
  })

  it('应解析中文摘要', () => {
    const titles = result.frontMatter.abstractZh.filter(
      (n) => n.type === NodeType.ABSTRACT_ZH_TITLE,
    )
    expect(titles.length).toBe(1)
    expect(titles[0].text).toBe('中文摘要')
  })

  it('应解析中文关键词', () => {
    const kw = result.frontMatter.abstractZh.find(
      (n) => n.type === NodeType.KEYWORDS_ZH,
    )
    expect(kw).toBeDefined()
    expect(kw?.text).toContain('关键词：')
  })

  it('应解析社科一级标题（中文数字+顿号）', () => {
    const h1s = result.body.filter((n) => n.type === NodeType.HEADING_1)
    expect(h1s.length).toBeGreaterThanOrEqual(3)
    expect(h1s[0].text).toBe('一、绪论')
    expect(h1s[1].text).toBe('二、相关工作与理论基础')
  })

  it('应解析社科二级标题（全角括号）', () => {
    const h2s = result.body.filter((n) => n.type === NodeType.HEADING_2)
    expect(h2s.length).toBeGreaterThanOrEqual(4)
    expect(h2s[0].text).toContain('（一）')
  })

  it('应解析社科三级标题（数字.）', () => {
    const h3s = result.body.filter((n) => n.type === NodeType.HEADING_3)
    expect(h3s.length).toBe(1)
    expect(h3s[0].text).toBe('1. 国内外研究现状')
  })

  it('应解析图题', () => {
    const figs = result.body.filter((n) => n.type === NodeType.FIGURE_CAPTION)
    expect(figs.length).toBe(1)
    expect(figs[0].text).toContain('图2-1')
  })

  it('应解析表题', () => {
    const tables = result.body.filter((n) => n.type === NodeType.TABLE_CAPTION)
    expect(tables.length).toBe(1)
    expect(tables[0].text).toContain('表2-1')
  })

  it('应解析公式', () => {
    const formulas = result.body.filter((n) => n.type === NodeType.FORMULA)
    expect(formulas.length).toBe(1)
    expect(formulas[0].text).toContain('3-1')
  })

  it('应解析致谢标题', () => {
    const ack = result.backMatter.acknowledgement.find(
      (n) => n.type === NodeType.ACK_TITLE,
    )
    expect(ack).toBeDefined()
    expect(ack?.text).toMatch(/致\s*谢/)
  })

  it('应解析参考文献条目', () => {
    const refs = result.backMatter.references.filter(
      (n) => n.type === NodeType.REF_ITEM,
    )
    expect(refs.length).toBe(2)
    expect(refs[0].text).toContain('[1]')
  })

  it('正文段落为默认类型', () => {
    const paras = result.body.filter((n) => n.type === NodeType.PARAGRAPH)
    expect(paras.length).toBeGreaterThan(5)
  })
})

describe('parseThesis - 理工类', () => {
  const result = parseThesis(SCIENCE_SAMPLE, {
    discipline: Discipline.SCIENCE_ENGINEERING,
    isMarkdown: true,
  })

  it('应解析Markdown二级标题为HEADING_2', () => {
    const h2s = result.body.filter((n) => n.type === NodeType.HEADING_2)
    expect(h2s.length).toBe(2)
    expect(h2s[0].text).toContain('绪论')
    expect(h2s[1].text).toContain('相关工作')
  })

  it('应解析Markdown三级标题为HEADING_3', () => {
    const h3s = result.body.filter((n) => n.type === NodeType.HEADING_3)
    expect(h3s.length).toBe(4)
  })
})

describe('parseThesis - 自动检测', () => {
  it('社科类文本应自动识别为社科模式', () => {
    const result = parseThesis(SOCIAL_SAMPLE)
    expect(result.frontMatter.title?.text).toBe('基于深度学习的图像识别研究')
    // 验证社科标题被识别
    const h1s = result.body.filter((n) => n.type === NodeType.HEADING_1)
    expect(h1s[0].text).toBe('一、绪论')
  })

  it('空文本返回空AST', () => {
    const result = parseThesis('')
    expect(result.frontMatter.title).toBeNull()
    expect(result.body.length).toBe(0)
  })
})
