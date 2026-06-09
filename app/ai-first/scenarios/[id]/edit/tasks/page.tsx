"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sparkles, Check, ArrowRight, Star, ChevronRight, Wand2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { scenarios } from "@/lib/mock-data"
import { mockTaskChainSuggestion, mockAiGeneratedQuestions, mockAiOnsiteQuestions } from "@/lib/ai-mock-data"

export default function AiFirstTasksEditPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params.id as string
  const existingScenario = scenarios.find(s => s.id === scenarioId)

  const [step, setStep] = useState(0)
  const [aiTaskChain, setAiTaskChain] = useState<ReturnType<typeof mockTaskChainSuggestion> | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [tasks, setTasks] = useState<{ name: string; type: string; difficulty: number; hours: number }[]>([])
  const [showQuestionGen, setShowQuestionGen] = useState(false)
  const [questions, setQuestions] = useState<ReturnType<typeof mockAiGeneratedQuestions> | null>(null)

  const steps = [
    { title: "AI 建议任务链", desc: "AI 分析场景主题，建议最佳任务结构" },
    { title: "配置测评资源", desc: "AI 智能出题与评价规则配置" },
    { title: "确认完成", desc: "审核并保存任务链配置" },
  ]

  const handleAiSuggest = () => {
    setAiLoading(true)
    setTimeout(() => {
      const result = mockTaskChainSuggestion(
        existingScenario?.name || "",
        existingScenario?.positionName || ""
      )
      setAiTaskChain(result)
      setTasks(result.tasks.map(t => ({ name: t.name, type: t.type, difficulty: t.difficulty, hours: t.estimatedHours })))
      setAiLoading(false)
    }, 1500)
  }

  const handleGenerateQuestions = () => {
    setAiLoading(true)
    setTimeout(() => {
      setQuestions(mockAiGeneratedQuestions("React 核心概念", "single", 5))
      setAiLoading(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">AI 任务链配置向导</h1>
              <p className="text-xs text-gray-500">{existingScenario?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/ai-first")}>
            <X className="h-4 w-4 mr-1" />
            退出
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                  i < step ? "bg-green-500 text-white" : i === step ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", i <= step ? "text-gray-900" : "text-gray-400")}>{s.title}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("h-px flex-1", i < step ? "bg-green-500" : "bg-gray-200")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">AI 建议任务链结构</h2>
              <p className="text-sm text-gray-500">AI 将基于场景主题「{existingScenario?.name}」分析最佳任务链结构</p>
            </div>

            {!aiTaskChain ? (
              <Card className="max-w-xl mx-auto">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-medium">获取 AI 任务链建议</h2>
                  <p className="text-sm text-gray-500">AI 将分析场景主题和目标岗位，建议合理的任务数量、类型配比和递进关系</p>
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                    onClick={handleAiSuggest}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {aiLoading ? "AI 分析中..." : "获取 AI 建议"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-purple-50 rounded-lg p-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">{aiTaskChain.taskCount}</div>
                    <div className="text-xs text-gray-500">建议任务数</div>
                  </div>
                  <div className="w-px h-10 bg-purple-200" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">{aiTaskChain.assessmentCount}</div>
                    <div className="text-xs text-gray-500">考核任务</div>
                  </div>
                  <div className="w-px h-10 bg-purple-200" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{aiTaskChain.trainingCount}</div>
                    <div className="text-xs text-gray-500">训练任务</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {tasks.map((t, i) => (
                    <Card key={i} className="border-purple-100">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm flex items-center justify-center font-medium">{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Input
                                value={t.name}
                                onChange={(e) => {
                                  const newTasks = [...tasks]
                                  newTasks[i].name = e.target.value
                                  setTasks(newTasks)
                                }}
                                className="h-8 text-sm font-medium"
                              />
                              <Badge variant="outline" className={cn("text-xs shrink-0", t.type === "assessment" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700")}>
                                {t.type === "assessment" ? "考核" : "训练"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">难度：</span>
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <button
                                    key={level}
                                    type="button"
                                    onClick={() => {
                                      const newTasks = [...tasks]
                                      newTasks[i].difficulty = level
                                      setTasks(newTasks)
                                    }}
                                    className="p-0.5"
                                  >
                                    <Star className={cn("h-3.5 w-3.5", level <= t.difficulty ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">学时：</span>
                                <Input
                                  type="number"
                                  value={t.hours}
                                  onChange={(e) => {
                                    const newTasks = [...tasks]
                                    newTasks[i].hours = parseInt(e.target.value) || 0
                                    setTasks(newTasks)
                                  }}
                                  className="w-16 h-7 text-xs"
                                />
                                <span className="text-xs text-gray-500">小时</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setTasks([...tasks, { name: "", type: "training", difficulty: 3, hours: 4 }])}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加任务
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800" onClick={handleAiSuggest}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    重新生成建议
                  </Button>
                  <Button variant="outline" className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800" onClick={() => setStep(1)}>
                    确认任务链，继续配置测评
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">AI 配置测评资源</h2>
              <p className="text-sm text-gray-500">AI 将为每个任务智能生成题库、评价点和评分规则</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-purple-200 hover:border-purple-400 cursor-pointer transition-colors" onClick={handleGenerateQuestions}>
                <CardContent className="p-6 text-center space-y-2">
                  <Sparkles className="h-6 w-6 text-purple-500 mx-auto" />
                  <p className="text-sm font-medium">AI 智能出题</p>
                  <p className="text-xs text-gray-500">基于知识点自动生成题目和参考答案</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200 hover:border-purple-400 cursor-pointer transition-colors">
                <CardContent className="p-6 text-center space-y-2">
                  <Sparkles className="h-6 w-6 text-purple-500 mx-auto" />
                  <p className="text-sm font-medium">AI 推荐评价点</p>
                  <p className="text-xs text-gray-500">基于任务目标智能推荐评价维度</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200 hover:border-purple-400 cursor-pointer transition-colors">
                <CardContent className="p-6 text-center space-y-2">
                  <Sparkles className="h-6 w-6 text-purple-500 mx-auto" />
                  <p className="text-sm font-medium">AI 生成量规</p>
                  <p className="text-xs text-gray-500">自动生成各等级评分描述文案</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200 hover:border-purple-400 cursor-pointer transition-colors">
                <CardContent className="p-6 text-center space-y-2">
                  <Sparkles className="h-6 w-6 text-purple-500 mx-auto" />
                  <p className="text-sm font-medium">AI 推荐配套资源</p>
                  <p className="text-xs text-gray-500">基于任务内容推荐学习资源</p>
                </CardContent>
              </Card>
            </div>

            {questions && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI 生成的题目预览
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">{q.type}</Badge>
                        <span className="text-xs text-gray-500">{q.knowledgePointTag}</span>
                      </div>
                      <p className="text-sm text-gray-800">{q.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
                返回任务链
              </Button>
              <Button variant="outline" className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800" onClick={() => setStep(2)}>
                确认并完成配置
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                <Check className="h-4 w-4" />
                任务链配置完成
              </div>
              <h2 className="text-xl font-semibold text-gray-900">AI 已帮你完成以下配置</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-purple-50/30 border-purple-200">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">任务链结构</span>
                  </div>
                  <p className="text-xs text-gray-600">已配置 {tasks.length} 个任务，含 {tasks.filter(t => t.type === "assessment").length} 个考核任务</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50/30 border-purple-200">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">测评资源</span>
                  </div>
                  <p className="text-xs text-gray-600">已生成 {(questions || []).length} 道 AI 题目，配置了评价点和量规</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50/30 border-purple-200">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">知识点关联</span>
                  </div>
                  <p className="text-xs text-gray-600">AI 已推荐关联知识点和能力点</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50/30 border-purple-200">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">配套资源</span>
                  </div>
                  <p className="text-xs text-gray-600">AI 已推荐 6 项配套学习资源</p>
                </CardContent>
              </Card>
            </div>

            <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 h-12 text-base" onClick={() => router.push("/ai-first")}>
              完成配置，返回首页
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-4 py-3 border-b", className)}>{children}</div>
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-sm font-medium", className)}>{children}</h3>
}
