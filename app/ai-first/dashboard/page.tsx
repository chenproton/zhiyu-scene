"use client"

import { useState } from "react"
import { Sparkles, BarChart3, Users, BookOpen, MessageSquare, TrendingUp, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiChatPanel } from "@/components/ai/ai-chat-panel"
import { AiGenerateButton } from "@/components/ai/ai-generate-button"
import { cn } from "@/lib/utils"
import {
  mockAiClassReport,
  mockAiConsistencyAnalysis,
  mockAiLearningAssistantResponse,
} from "@/lib/ai-mock-data"
import type { AiClassReport, AiConsistencyAnalysis } from "@/lib/ai-mock-data"

export default function AiFirstDashboard() {
  const [classReport, setClassReport] = useState<AiClassReport | null>(null)
  const [classLoading, setClassLoading] = useState(false)
  const [consistencyAnalysis, setConsistencyAnalysis] = useState<AiConsistencyAnalysis | null>(null)
  const [consistencyLoading, setConsistencyLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bot className="h-6 w-6 text-purple-500" />
              AI 教学指挥中心
            </h1>
            <p className="text-gray-500 mt-1">一站式 AI 学情分析、评分监控与教学改进建议</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: <BarChart3 className="h-5 w-5" />, title: "班级学情报告", desc: "AI 分析班级整体表现", color: "bg-blue-50 text-blue-700 border-blue-200" },
            { icon: <Users className="h-5 w-5" />, title: "评分一致性监控", desc: "检测教师评分偏差", color: "bg-purple-50 text-purple-700 border-purple-200" },
            { icon: <BookOpen className="h-5 w-5" />, title: "薄弱知识点追踪", desc: "全班级知识掌握分析", color: "bg-amber-50 text-amber-700 border-amber-200" },
            { icon: <TrendingUp className="h-5 w-5" />, title: "教学改进建议", desc: "AI 生成个性化教学方案", color: "bg-green-50 text-green-700 border-green-200" },
          ].map((action, i) => (
            <Card key={i} className={cn("cursor-pointer hover:shadow-md transition-shadow", action.color)}>
              <CardContent className="p-4 space-y-2">
                <div className="text-purple-600">{action.icon}</div>
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs opacity-80">{action.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="class" className="space-y-4">
          <TabsList>
            <TabsTrigger value="class" className="gap-2">
              <BookOpen className="h-4 w-4" />
              班级学情分析
            </TabsTrigger>
            <TabsTrigger value="consistency" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              评分一致性监控
            </TabsTrigger>
          </TabsList>

          <TabsContent value="class" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">班级学情 AI 分析报告</h2>
                <p className="text-sm text-gray-500">选择场景和班级后，AI 自动生成综合分析报告</p>
              </div>
              <AiGenerateButton
                onClick={() => {
                  setClassLoading(true)
                  setTimeout(() => {
                    setClassReport(mockAiClassReport())
                    setClassLoading(false)
                  }, 1500)
                }}
                loading={classLoading}
                label="AI 生成班级学情报告"
              />
            </div>

            {classReport && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">班级整体得分分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 h-32">
                      {classReport.overallDistribution.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="text-xs font-medium text-gray-700">{d.count}人</div>
                          <div className={cn("w-full rounded-t", i === 0 ? "bg-green-400" : i === 1 ? "bg-blue-400" : i === 2 ? "bg-yellow-400" : "bg-red-400")} style={{ height: `${d.percentage * 1.2}px` }} />
                          <div className="text-[10px] text-gray-500">{d.range}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">高频失分知识点 Top 5</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {classReport.weakPoints.map((wp, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-800">{wp.name}</span>
                              <span className="text-xs text-gray-500">均分 {wp.avgScore}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${wp.avgScore}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">需要重点关注的学生</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {classReport.attentionList.map((st, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 bg-red-50 rounded-lg border border-red-100">
                          <span className="text-red-500 mt-0.5">!</span>
                          <div>
                            <span className="text-sm font-medium text-gray-800">{st.studentName}</span>
                            <p className="text-xs text-gray-600 mt-0.5">{st.reason}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI 教学改进建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {classReport.teachingSuggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-purple-500 mt-0.5">✓</span>
                        <span className="text-gray-800">{s}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="consistency" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">评分标准一致性分析</h2>
                <p className="text-sm text-gray-500">按场景+任务维度，AI 分析所有教师的评分数据一致性</p>
              </div>
              <AiGenerateButton
                onClick={() => {
                  setConsistencyLoading(true)
                  setTimeout(() => {
                    setConsistencyAnalysis(mockAiConsistencyAnalysis())
                    setConsistencyLoading(false)
                  }, 1500)
                }}
                loading={consistencyLoading}
                label="AI 分析评分一致性"
              />
            </div>

            {consistencyAnalysis && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">教师间评分离散度热力图</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {consistencyAnalysis.heatmap.map((h, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="text-sm font-medium text-gray-700">{h.evalPoint}</div>
                          <div className="flex items-center gap-2">
                            {h.teacherScores.map((ts, j) => (
                              <div key={j} className="flex-1">
                                <div className="text-[10px] text-gray-500 mb-0.5 text-center">{ts.teacher}</div>
                                <div className={cn("h-8 rounded flex items-center justify-center text-xs font-medium text-white", ts.score >= 85 ? "bg-green-400" : ts.score >= 75 ? "bg-blue-400" : ts.score >= 60 ? "bg-yellow-400" : "bg-red-400")}>
                                  {ts.score}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI 建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {consistencyAnalysis.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-purple-500 mt-0.5">✓</span>
                        <span className="text-gray-800">{s}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant */}
      <AiChatPanel
        title="AI 教学助手"
        quickQuestions={[
          "哪个班级需要重点关注？",
          "评分一致性有什么问题？",
          "有哪些教学改进建议？",
        ]}
        onSendMessage={(msg) => mockAiLearningAssistantResponse(msg, { scenarioName: "教学指挥中心", taskName: "学情分析" })}
        defaultExpanded={false}
      />
    </div>
  )
}
