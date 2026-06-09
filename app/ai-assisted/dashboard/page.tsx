"use client"

import { useState } from "react"
import {
  BarChart3,
  Sparkles,
  Users,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AiGenerateButton } from "@/components/ai/ai-generate-button"
import { cn } from "@/lib/utils"
import {
  mockAiConsistencyAnalysis,
  mockAiClassReport,
} from "@/lib/ai-mock-data"
import type { AiConsistencyAnalysis, AiClassReport } from "@/lib/ai-mock-data"

export default function AiAnalyticsDashboard() {
  const [consistencyAnalysis, setConsistencyAnalysis] = useState<AiConsistencyAnalysis | null>(null)
  const [consistencyLoading, setConsistencyLoading] = useState(false)
  const [classReport, setClassReport] = useState<AiClassReport | null>(null)
  const [classReportLoading, setClassReportLoading] = useState(false)
  const [expandedOutliers, setExpandedOutliers] = useState(true)

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            AI 学情分析与评分质量监控
          </h1>
          <p className="text-gray-500 mt-1">智能分析评分一致性、班级学情和教学改进建议</p>
        </div>
      </div>

      <Tabs defaultValue="class" className="space-y-4">
        <TabsList>
          <TabsTrigger value="class" className="gap-2">
            <BookOpen className="h-4 w-4" />
            班级学情分析
          </TabsTrigger>
          <TabsTrigger value="consistency" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            评分一致性分析
          </TabsTrigger>
        </TabsList>

        {/* 班级学情分析 */}
        <TabsContent value="class" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">班级学情 AI 分析报告</h2>
              <p className="text-sm text-gray-500">选择场景和班级后，AI 自动生成综合分析报告</p>
            </div>
            <AiGenerateButton
              onClick={() => {
                setClassReportLoading(true)
                setTimeout(() => {
                  setClassReport(mockAiClassReport())
                  setClassReportLoading(false)
                }, 1500)
              }}
              loading={classReportLoading}
              label="AI 生成班级学情报告"
            />
          </div>

          {classReport && (
            <div className="space-y-4">
              {/* 整体分布 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    班级整体得分分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-32">
                    {classReport.overallDistribution.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-xs font-medium text-gray-700">{d.count}人</div>
                        <div
                          className={cn(
                            "w-full rounded-t transition-all",
                            i === 0 ? "bg-green-400" : i === 1 ? "bg-blue-400" : i === 2 ? "bg-yellow-400" : "bg-red-400"
                          )}
                          style={{ height: `${d.percentage * 1.2}px` }}
                        />
                        <div className="text-[10px] text-gray-500">{d.range}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 薄弱知识点 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    高频失分知识点 Top 5
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {classReport.weakPoints.map((wp, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800">{wp.name}</span>
                          <span className="text-xs text-gray-500">均分 {wp.avgScore} · 不及格率 {wp.failRate}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${wp.avgScore}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 关注名单 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-500" />
                    需要重点关注的学生
                  </CardTitle>
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

              {/* 教学改进建议 */}
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
                      <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                      <span className="text-gray-800">{s}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* 评分一致性分析 */}
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
              {/* 热力图 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">教师间评分离散度热力图</CardTitle>
                  <CardDescription>哪些评价点分歧最大</CardDescription>
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
                              <div
                                className={cn(
                                  "h-8 rounded flex items-center justify-center text-xs font-medium text-white",
                                  ts.score >= 85 ? "bg-green-400" : ts.score >= 75 ? "bg-blue-400" : ts.score >= 60 ? "bg-yellow-400" : "bg-red-400"
                                )}
                              >
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

              {/* 异常预警 */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    评分分布异常预警
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => setExpandedOutliers(!expandedOutliers)}
                    className="w-full flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-amber-800">发现 {consistencyAnalysis.outliers.length} 条异常记录</span>
                    {expandedOutliers ? <ChevronUp className="h-4 w-4 text-amber-600" /> : <ChevronDown className="h-4 w-4 text-amber-600" />}
                  </button>
                  {expandedOutliers && (
                    <div className="space-y-2 pt-1">
                      {consistencyAnalysis.outliers.map((o, i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px]">{o.teacher}</Badge>
                            <span className="text-sm font-medium text-gray-800">{o.evalPoint}</span>
                            <Badge variant="outline" className={cn("text-[10px]", o.deviation > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                              偏差 {o.deviation > 0 ? "+" : ""}{o.deviation}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{o.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI 建议 */}
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
                      <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
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
  )
}
