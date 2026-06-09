"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sparkles, Bot, MessageSquare, Award, TrendingUp, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiChatPanel } from "@/components/ai/ai-chat-panel"
import { AiGenerateButton } from "@/components/ai/ai-generate-button"
import { mockAiCompetencySummary, mockAiLearningAssistantResponse } from "@/lib/ai-mock-data"
import type { AiCompetencySummary } from "@/lib/ai-mock-data"
import {
  students,
  studentScenarioScores,
  studentAbilityScores,
  positionAbilities,
  professions,
} from "@/lib/mock-data"

export default function AiFirstCompetencyPage() {
  const params = useParams()
  const studentId = params.id as string
  const student = students.find(s => s.id === studentId)
  const scenarioScores = studentScenarioScores.filter(s => s.studentId === studentId)
  const abilityScores = studentAbilityScores.filter(s => s.studentId === studentId)

  const [aiSummary, setAiSummary] = useState<AiCompetencySummary | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">学生不存在</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/students">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bot className="h-6 w-6 text-purple-500" />
                AI 能力画像中心
              </h1>
              <p className="text-gray-500">AI 驱动的学生能力分析与智能洞察</p>
            </div>
          </div>
          <AiGenerateButton
            onClick={() => {
              setAiLoading(true)
              setTimeout(() => {
                setAiSummary(mockAiCompetencySummary(student.name))
                setAiLoading(false)
              }, 1200)
            }}
            loading={aiLoading}
            label="AI 生成能力画像"
          />
        </div>

        {/* Student Profile */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>{student.studentNumber}</span>
                  <span>{student.class}</span>
                  <span>{student.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{scenarioScores.length}</p>
                  <p className="text-sm text-gray-400">完成场景</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {scenarioScores.length > 0 
                      ? Math.round(scenarioScores.reduce((sum, s) => sum + s.totalScore, 0) / scenarioScores.length)
                      : "-"
                    }
                  </p>
                  <p className="text-sm text-gray-400">平均得分</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        {aiSummary && (
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-purple-900">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI 能力画像摘要
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-800 leading-relaxed">{aiSummary.summary}</p>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      跨场景能力变化趋势
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-3 h-24">
                      {aiSummary.trends.map((t, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="text-xs font-medium text-purple-700">{t.score}</div>
                          <div className="w-full bg-gray-100 rounded-t relative" style={{ height: `${(t.score / 100) * 80}px` }}>
                            <div className="absolute bottom-0 left-0 right-0 bg-purple-400 rounded-t" style={{ height: `${(t.score / 100) * 80}px` }} />
                          </div>
                          <div className="text-[10px] text-gray-500 text-center truncate w-full">{t.scenario.substring(0, 6)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      智能问答
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {aiSummary.qaPairs.map((qa, i) => (
                      <div key={i} className="bg-white rounded-lg p-2.5 border text-xs space-y-1">
                        <p className="font-medium text-purple-800">Q: {qa.question}</p>
                        <p className="text-gray-700">{qa.answer}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="scenarios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="scenarios" className="gap-2">
              <BookOpen className="h-4 w-4" />
              场景学习记录
            </TabsTrigger>
            <TabsTrigger value="abilities" className="gap-2">
              <Award className="h-4 w-4" />
              能力点详情
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-4">
            {scenarioScores.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-400">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无场景学习记录</p>
                </CardContent>
              </Card>
            ) : (
              scenarioScores.map(score => (
                <Card key={score.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{score.scenarioName}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{score.totalScore}分</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {score.taskScores.map((ts, index) => (
                        <div key={ts.taskId} className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs text-gray-500">{index + 1}</span>
                          <span className="text-sm text-gray-700 flex-1">{ts.taskName}</span>
                          <span className="text-sm font-medium text-gray-800">{ts.score}/{ts.maxScore}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="abilities" className="space-y-4">
            {abilityScores.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无能力评估数据</p>
                </CardContent>
              </Card>
            ) : (
              abilityScores.map(ability => (
                <Card key={ability.abilityId}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{ability.abilityName}</span>
                        <Badge variant="outline" className="ml-2 text-xs">{ability.level}</Badge>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{ability.score}分</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant */}
      <AiChatPanel
        title="AI 学习助手"
        quickQuestions={[
          "这个学生的强项是什么？",
          "相比班级平均水平如何？",
          "他在哪个场景进步最大？",
        ]}
        onSendMessage={(msg) => mockAiLearningAssistantResponse(msg, { scenarioName: "学生能力分析", taskName: "能力画像诊断" })}
        defaultExpanded={false}
      />
    </div>
  )
}
