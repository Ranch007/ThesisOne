import { describe, it, expect } from 'vitest'
import { parseThesis } from '@/parser'
import { Discipline } from '@/types/ast'
import { validateFormat } from '@/validator'

const SAMPLE = `深度学习研究

一、绪论

研究背景介绍。

（一）问题描述

这是问题描述段落。

1. 具体问题

这是具体的子问题描述。

（二）研究目标

本文的研究目标如下。

二、理论基础

这是理论基础章节。

图2-1 网络结构图

图2-3 性能对比图

表2-1 实验结果

三、实验分析

图3-2 实验流程图

表3-1 参数设置

参考文献
[1] 张三. 深度学习[J]. 计算机学报, 2023.
`

describe('Validator - 全量检测', () => {
  const ast = parseThesis(SAMPLE, { discipline: Discipline.SOCIAL_SCIENCE })
  const issues = validateFormat(ast, [])

  it('应检测标题层级', () => {
    const headingIssues = issues.filter((i) => i.type === 'heading_skip')
    // L1 → L2(一) → L3(1.) → L2(二) 无跳级
    expect(headingIssues.length).toBe(0)
  })

  it('应检测图表编号不连续', () => {
    const figIssues = issues.filter((i) => i.type === 'figure_gap')
    // 图2-1 → 图2-3 跳号
    expect(figIssues.length).toBeGreaterThan(0)
  })

  it('应检测孤立引用', () => {
    // 添加带引用的正文来测试
    const text = `测试论文

一、绪论

根据文献[1]的研究，深度学习取得了显著进展。然而文献[99]的方法存在缺陷。

参考文献
[1] 张三. 深度学习[J]. 计算机学报, 2023.
`
    const a = parseThesis(text, { discipline: Discipline.SOCIAL_SCIENCE })
    const refs = [{ id: 'r1', index: 1 } as any]
    const issues = validateFormat(a, refs)
    const citeIssues = issues.filter((i) => i.type === 'citation_mismatch')

    // [99] 在文献库中不存在 → 孤立引用
    expect(citeIssues.some((i) => i.message.includes('[99]'))).toBe(true)
  })
})

describe('Validator - 标题跳级检测', () => {
  it('应检测HEADING_2直接到HEADING_4的跳级', () => {
    const text = `测试论文

一、绪论

（一）背景

二、相关研究
`
    const ast = parseThesis(text, { discipline: Discipline.SOCIAL_SCIENCE })
    const issues = validateFormat(ast, [])
    // L1 → L2 → L1 正常，不跳级
    const skips = issues.filter((i) => i.type === 'heading_skip')
    expect(skips.length).toBe(0)
  })
})

describe('Validator - 正确编号不报警', () => {
  it('连续编号不应报警', () => {
    const text = `测试论文

一、章节

图1-1 第一图

图1-2 第二图

表1-1 第一表

表1-2 第二表
`
    const ast = parseThesis(text, { discipline: Discipline.SOCIAL_SCIENCE })
    const issues = validateFormat(ast, [])
    const figIssues = issues.filter((i) => i.type === 'figure_gap')
    expect(figIssues.length).toBe(0)
  })
})
