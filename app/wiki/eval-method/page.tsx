"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { BookOpen, CheckCircle2, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const wikiContent: Record<string, { title: string; content: string; category: string; available: boolean }> = {
  random_draw: {
    title: "现场问答",
    category: "综合评估",
    available: true,
    content: `现场问答是一种灵活的综合评估方式。教师从题库中随机抽取题目，在课堂上对学生进行现场提问。这种方式可以考察学生的知识掌握程度和临场应变能力。

## 适用场景

- 需要快速检验学习效果的课堂环节
- 考察学生知识掌握程度和临场应变能力
- 小班教学或一对一辅导场景

## 配置说明

1. **抽题规则**：设置抽取题数和难度分布
2. **题型范围**：可选择单选题、多选题、判断题等
3. **评价点**：配置现场问答的评价维度，如知识掌握、沟通表达等

## 学生端体验

学生进入任务后，系统会展示抽到的题目。学生需要现场作答，教师根据回答情况进行评分。`,
  },
  review: {
    title: "现场评审",
    category: "综合评估",
    available: true,
    content: `现场评审是由教师或专家根据学生提交的材料或现场表现进行打分评价的方式。评审过程通常包含材料初审、现场答辩、专家合议等环节。

## 适用场景

- 项目报告、设计作品等需要综合判断的学习成果评价
- 毕业设计、课程大作业等终结性评价
- 需要多轮评审保证公平性的场景

## 配置说明

1. **评审材料要求**：设置学生需要提交的材料类型和格式
2. **评审流程**：配置初评、复评、终评等多轮评审步骤
3. **评审主体**：绑定教师、企业导师等评审人员
4. **评价量规**：定义评审的评分维度和权重

## 学生端体验

学生需要按照要求准备并提交评审材料。评审流程中可能包含现场答辩环节，学生需做好答辩准备。`,
  },
  paper: {
    title: "试卷",
    category: "基础考核",
    available: true,
    content: `试卷考核是使用固定题目组成的试卷对学生进行标准化测试的方式。试卷可以包含单选题、多选题、判断题、填空题、简答题等多种题型。

## 适用场景

- 基础知识掌握程度的客观评价
- 期中、期末等阶段性考核
- 需要统一标准的大规模测评

## 配置说明

1. **试卷创建**：从题库中选择题目组成固定试卷
2. **评分规则**：设置各题分值和及格分数线
3. **防作弊**：可配置题目乱序、选项乱序等

## 学生端体验

学生在规定时间内完成试卷作答，提交后系统自动判分。客观题自动评分，主观题由教师复核。`,
  },
  question_bank: {
    title: "题库",
    category: "基础考核",
    available: true,
    content: `题库测评是从题库中按照一定规则抽取题目组成测评卷的方式。系统支持按题型、难度、知识点等维度进行抽题配置，可实现千人千卷的个性化测评。

## 适用场景

- 大规模标准化考核场景
- 需要防止作弊的在线测评
- 自适应学习中的能力诊断

## 配置说明

1. **抽题规则**：设置随机抽题数量、难度分布
2. **时间限制**：配置答题时长
3. **重复测评**：可设置是否允许重复测评及次数
4. **成绩展示**：配置提交后是否立即展示成绩

## 学生端体验

学生进入测评后，系统根据抽题规则随机生成试卷。答完提交后，系统即时反馈成绩和答题解析。`,
  },
}

function EvalMethodWikiContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get("key") || ""
  const data = wikiContent[key]

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium text-gray-600">暂无介绍</p>
          <p className="text-sm mt-1">该测评形式的图文介绍尚未配置</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-gray-800">测评形式介绍</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Title section */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary/[0.03] to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
              <Badge variant="secondary" className="text-xs">{data.category}</Badge>
              {data.available ? (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  已开通
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-gray-400">未购买</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">了解该测评形式的使用场景和配置说明</p>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-headings:font-semibold prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
              {data.content.split("\n\n").map((paragraph, idx) => {
                if (paragraph.startsWith("## ")) {
                  return <h3 key={idx} className="text-lg font-semibold text-gray-800 mt-8 mb-3">{paragraph.replace("## ", "")}</h3>
                }
                if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
                  const items = paragraph.split("\n").filter(Boolean)
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-2 mt-3 mb-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-600 text-sm leading-relaxed">{item.replace(/^[-\d.]+\s*/, "")}</li>
                      ))}
                    </ul>
                  )
                }
                return <p key={idx} className="text-sm text-gray-600 leading-relaxed mb-4">{paragraph}</p>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EvalMethodWikiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50 animate-pulse" />
          <p className="text-sm">加载中...</p>
        </div>
      </div>
    }>
      <EvalMethodWikiContent />
    </Suspense>
  )
}
