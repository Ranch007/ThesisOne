import { describe, it, expect } from 'vitest'
import { parseThesis } from '@/parser'
import { buildDocument } from '@/exporter'
import { Discipline, NodeType } from '@/types/ast'
import { ReferenceType } from '@/types/reference'
import { DEFAULT_CONFIG } from '@/constants/defaults'

const FULL_PAPER = `基于深度学习的图像识别系统设计与实现

学生：计算机科学与技术学院 张三
指导教师：李四 教授

中文摘要
本文设计并实现了一套基于深度学习的图像识别系统。采用改进的卷积神经网络模型，
在多个公开数据集上取得了优异的识别效果。系统支持图像分类、目标检测等功能，
具有较高的实用价值和应用前景。
关键词：深度学习；图像识别；卷积神经网络；系统设计

Abstract
This paper designs and implements a deep learning based image recognition system.
An improved CNN model is proposed and achieves excellent results on multiple datasets.
Keywords: deep learning; image recognition; CNN; system design

一、绪论

随着人工智能技术的快速发展，深度学习在计算机视觉领域取得了突破性进展。
图像识别作为计算机视觉的核心任务，在工业检测、医疗诊断、自动驾驶等
领域具有广泛的应用前景。

（一）研究背景与意义

本文将研究背景分为以下几个方面进行阐述。

1. 深度学习的发展历程

深度学习技术经历了从感知机到深度神经网络的发展过程。
卷积神经网络的出现使得图像识别准确率大幅提升。

2. 图像识别的应用场景

图像识别技术已广泛应用于人脸识别、商品识别、医学影像分析等领域。

（二）国内外研究现状

目前，国内外学者在图像识别领域开展了大量研究工作。

（三）本文主要工作

本文的主要贡献包括以下几个方面。

1. 模型改进

提出了一种结合注意力机制的改进卷积神经网络模型。

2. 系统实现

设计并实现了一个完整的图像识别系统。

二、相关技术基础

本章介绍系统所涉及的核心技术。

（一）卷积神经网络

CNN通过卷积层、池化层和全连接层的组合实现图像特征提取。

图2-1 卷积神经网络结构示意图

（二）注意力机制

注意力机制借鉴人类视觉的选择性注意特性。

图2-2 注意力模块结构图

（三）模型评估指标

常用的评估指标包括准确率、精确率、召回率和F1分数。

表2-1 常用评估指标说明

三、系统设计与实现

本章详细描述系统的设计方案和实现细节。

（一）系统架构设计

系统采用B/S架构，前端使用Web技术，后端基于Python Flask框架。

图3-1 系统整体架构图

（二）核心模块实现

系统包含数据预处理、模型训练、推理预测和结果展示四大模块。

表3-1 系统模块功能说明

（三）性能优化

通过模型量化、知识蒸馏等技术优化推理速度。

四、实验结果与分析

本章对系统进行全面的实验评估。

（一）实验环境与数据集

实验使用CIFAR-10和ImageNet数据集。

表4-1 实验数据集统计信息

（二）模型性能对比

将提出的模型与主流模型进行对比实验。

图4-1 各模型准确率对比图

表4-2 各模型性能对比结果

（三）系统性能测试

对系统的响应时间和吞吐量进行测试。

图4-2 系统响应时间分布图

五、总结与展望

本文设计并实现了一套基于深度学习的图像识别系统。

（一）工作总结

本文完成的主要工作包括模型改进和系统实现。

（二）未来展望

未来将探索模型压缩和边缘设备部署等方向。

致谢

本论文是在李四教授的悉心指导下完成的。
同时感谢实验室各位同学的帮助与支持。

参考文献
[1] 张三, 李四. 深度学习综述[J]. 计算机学报, 2020, 43(1): 1-20.
[2] 王五, 赵六. 图像识别技术进展[J]. 软件学报, 2021, 32(3): 500-520.
[3] 陈七. 卷积神经网络原理与实践[M]. 北京: 科学出版社, 2019.
`

describe('端到端：解析→导出', () => {
  const ast = parseThesis(FULL_PAPER, { discipline: Discipline.SOCIAL_SCIENCE })

  it('应正确构建完整AST', () => {
    expect(ast.frontMatter.title).not.toBeNull()
    expect(ast.frontMatter.title?.text).toContain('图像识别')

    const zhAbstract = ast.frontMatter.abstractZh
    expect(zhAbstract.some((n) => n.type === NodeType.ABSTRACT_ZH_TITLE)).toBe(true)
    expect(zhAbstract.some((n) => n.type === NodeType.KEYWORDS_ZH)).toBe(true)

    const enAbstract = ast.frontMatter.abstractEn
    expect(enAbstract.some((n) => n.type === NodeType.ABSTRACT_EN_TITLE)).toBe(true)
    expect(enAbstract.some((n) => n.type === NodeType.KEYWORDS_EN)).toBe(true)

    const h1s = ast.body.filter((n) => n.type === NodeType.HEADING_1)
    expect(h1s.length).toBe(5)

    const h2s = ast.body.filter((n) => n.type === NodeType.HEADING_2)
    expect(h2s.length).toBeGreaterThan(5)

    const figs = ast.body.filter((n) => n.type === NodeType.FIGURE_CAPTION)
    expect(figs.length).toBeGreaterThanOrEqual(5)

    const tables = ast.body.filter((n) => n.type === NodeType.TABLE_CAPTION)
    expect(tables.length).toBeGreaterThanOrEqual(4)

    const refs = ast.backMatter.references.filter((n) => n.type === NodeType.REF_ITEM)
    expect(refs.length).toBe(3)

    const ack = ast.backMatter.acknowledgement
    expect(ack.some((n) => n.type === NodeType.ACK_TITLE)).toBe(true)
  })

  it('应成功构建DOCX Document', () => {
    const refs = [
      {
        id: '1', index: 1, rawText: '张三, 李四. 深度学习综述[J]. 计算机学报, 2020, 43(1): 1-20.',
      },
      {
        id: '2', index: 2, rawText: '王五, 赵六. 图像识别技术进展[J]. 软件学报, 2021, 32(3): 500-520.',
      },
      {
        id: '3', index: 3, rawText: '陈七. 卷积神经网络原理与实践[M]. 北京: 科学出版社, 2019.',
      },
    ]

    const doc = buildDocument({
      ast,
      config: DEFAULT_CONFIG,
      references: refs,
    })

    expect(doc).toBeDefined()
  })

  it('应支持社科/理工切换重新解析', () => {
    const sciResult = parseThesis(FULL_PAPER, {
      discipline: Discipline.SCIENCE_ENGINEERING,
    })
    // 社科类标题（一、二、三、四、五）在理工模式下不匹配，变为 PARAGRAPH
    const sciH1s = sciResult.body.filter((n) => n.type === NodeType.HEADING_1)
    // 范文中的 "1. XX" / "2. XX" 在理工模式下识别为一级标题（标准：1. XXXX）
    expect(sciH1s.length).toBe(4)
    // 社科二级标题（一）等在理工模式下不应匹配
    const sciH2s = sciResult.body.filter((n) => n.type === NodeType.HEADING_2)
    expect(sciH2s.length).toBe(0)
  })
})
