"use client"

import { ArrowLeft, Eye, Save } from "lucide-react"
import NextLink from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"
import { scenarios, type GradeMapping, type Task } from "@/lib/mock-data"

export default function RatingEditPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params.id as string

  const existingScenario = scenarios.find(s => s.id === scenarioId)
  const scenarioName = existingScenario?.name || "新场景"
  const tasks = existingScenario?.tasks || []

  // Weight allocation state
  const [taskWeights, setTaskWeights] = useState<{ taskId: string; taskName: string; weight: number; locked: boolean }[]>(
    tasks.map((t, index) => ({
      taskId: t.id,
      taskName: t.name,
      weight: existingScenario?.weightConfig?.tasks.find(w => w.taskId === t.id)?.weight || Math.floor(100 / tasks.length),
      locked: false,
    }))
  )

  // Selected task for grade mapping
  const [selectedTaskForGrade, setSelectedTaskForGrade] = useState<string | null>(tasks[0]?.id || null)

  // Grade mapping per task
  const [taskGradeMappings, setTaskGradeMappings] = useState<Record<string, GradeMapping[]>>(
    tasks.reduce((acc, t) => ({
      ...acc,
      [t.id]: existingScenario?.gradeMapping || [
        { id: "grade-1", grade: "A", minScore: 90, maxScore: 100, color: "bg-green-500" },
        { id: "grade-2", grade: "B", minScore: 75, maxScore: 89, color: "bg-blue-500" },
        { id: "grade-3", grade: "C", minScore: 60, maxScore: 74, color: "bg-yellow-500" },
        { id: "grade-4", grade: "D", minScore: 0, maxScore: 59, color: "bg-red-500" },
      ],
    }), {} as Record<string, GradeMapping[]>)
  )

  const [isEditingGrades, setIsEditingGrades] = useState(false)
  const [testScore, setTestScore] = useState(85)

  const totalWeight = taskWeights.reduce((sum, t) => sum + t.weight, 0)
  const isWeightValid = totalWeight === 100

  const handleWeightChange = (taskId: string, newWeight: number) => {
    setTaskWeights(prev => prev.map(t =>
      t.taskId === taskId ? { ...t, weight: Math.max(0, Math.min(100, newWeight)) } : t
    ))
  }

  const toggleLock = (taskId: string) => {
    setTaskWeights(prev => prev.map(t =>
      t.taskId === taskId ? { ...t, locked: !t.locked } : t
    ))
  }

  const distributeEvenly = () => {
    const unlockedTasks = taskWeights.filter(t => !t.locked)
    const lockedWeight = taskWeights.filter(t => t.locked).reduce((sum, t) => sum + t.weight, 0)
    const remainingWeight = 100 - lockedWeight
    const weightPerTask = Math.floor(remainingWeight / unlockedTasks.length)
    const remainder = remainingWeight % unlockedTasks.length

    let unlockedIndex = 0
    setTaskWeights(prev => prev.map(t => {
      if (t.locked) return t
      const extra = unlockedIndex < remainder ? 1 : 0
      unlockedIndex++
      return { ...t, weight: weightPerTask + extra }
    }))
  }

  const currentGradeMapping = selectedTaskForGrade ? taskGradeMappings[selectedTaskForGrade] : []

  const handleGradeChange = (gradeId: string, field: keyof GradeMapping, value: string | number) => {
    if (!selectedTaskForGrade) return
    setTaskGradeMappings(prev => ({
      ...prev,
      [selectedTaskForGrade]: prev[selectedTaskForGrade].map(g =>
        g.id === gradeId ? { ...g, [field]: value } : g
      )
    }))
  }

  const getGradeForScore = (score: number) => {
    return currentGradeMapping.find(g => score >= g.minScore && score <= g.maxScore)
  }

  const handleSave = () => {
    console.log("Saving rating rules:", { taskWeights, taskGradeMappings })
    router.push(`/scenarios/${scenarioId}/edit/tasks`)
  }

  const handleSaveDraft = () => {
    console.log("Saving draft...")
  }

  const handlePreview = () => {
    console.log("Preview...")
  }

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-pink-500",
  ]

  const colorOptions = [
    { value: "bg-green-500", light: "bg-green-50 border-green-200 text-green-700" },
    { value: "bg-blue-500", light: "bg-blue-50 border-blue-200 text-blue-700" },
    { value: "bg-yellow-500", light: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { value: "bg-red-500", light: "bg-red-50 border-red-200 text-red-700" },
  ]

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <NextLink href={`/scenarios/${scenarioId}/edit/tasks`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回任务配置
              </Button>
            </NextLink>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Badge variant="outline">总评规则</Badge>
              <span className="text-sm text-gray-500">{scenarioName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              保存草稿
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              预览
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              保存规则
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">总评规则配置</h1>
          <p className="text-sm text-gray-500 mt-1">配置各任务权重和成绩等级映射</p>
        </div>

        {/* Weight allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">任务权重分配</CardTitle>
            <CardDescription>设置各任务在总评中的权重占比，总和必须为 100%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={cn(
                  "text-lg font-semibold",
                  isWeightValid ? "text-green-600" : "text-amber-600"
                )}>
                  总权重: {totalWeight}%
                </span>
                {!isWeightValid && (
                  <span className="text-sm text-amber-600">
                    {totalWeight > 100 ? `超出 ${totalWeight - 100}%` : `还需分配 ${100 - totalWeight}%`}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={distributeEvenly}>
                均匀分配
              </Button>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
              {taskWeights.map((task, index) => (
                <div
                  key={task.taskId}
                  className={cn("transition-all duration-300", colors[index % colors.length])}
                  style={{ width: `${task.weight}%` }}
                />
              ))}
            </div>

            {/* Task weight inputs */}
            <div className="space-y-2">
              {taskWeights.map((task, index) => (
                <div
                  key={task.taskId}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors"
                >
                  <div className={cn("w-3 h-8 rounded-full shrink-0", colors[index % colors.length])} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-700 truncate">{task.taskName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Input
                      type="number"
                      value={task.weight}
                      onChange={(e) => handleWeightChange(task.taskId, parseInt(e.target.value) || 0)}
                      disabled={task.locked}
                      className={cn("w-20 text-center", task.locked && "bg-gray-50")}
                      min={0}
                      max={100}
                    />
                    <span className="text-gray-500 w-4">%</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLock(task.taskId)}
                    className={cn("h-8 w-8", task.locked ? "text-amber-500" : "text-gray-400")}
                  >
                    {task.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grade mapping */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">成绩等级映射</CardTitle>
            <CardDescription>选择任务后配置该任务的分数段与成绩等级的对应关系</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task selector */}
            <div className="flex gap-2 flex-wrap">
              {tasks.map((task, index) => (
                <Button
                  key={task.id}
                  variant={selectedTaskForGrade === task.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTaskForGrade(task.id)}
                >
                  <span className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    colors[index % colors.length]
                  )} />
                  {task.name}
                </Button>
              ))}
            </div>

            {selectedTaskForGrade && (
              <>
                {/* Edit toggle */}
                <div className="flex items-center justify-end">
                  <Button variant="outline" size="sm" onClick={() => setIsEditingGrades(!isEditingGrades)}>
                    {isEditingGrades ? "完成编辑" : "编辑等级"}
                  </Button>
                </div>

                {/* Visual grade bar */}
                <div className="h-10 bg-gray-100 rounded-lg overflow-hidden flex">
                  {currentGradeMapping
                    .sort((a, b) => a.minScore - b.minScore)
                    .map((grade) => {
                      const width = grade.maxScore - grade.minScore + 1
                      return (
                        <div
                          key={grade.id}
                          className={cn(
                            "flex items-center justify-center text-white font-medium text-sm transition-all",
                            grade.color
                          )}
                          style={{ width: `${width}%` }}
                        >
                          {grade.grade}
                        </div>
                      )
                    })}
                </div>

                {/* Grade cards */}
                <div className="grid grid-cols-2 gap-3">
                  {currentGradeMapping
                    .sort((a, b) => b.maxScore - a.maxScore)
                    .map((grade, index) => {
                      const colorConfig = colorOptions[index % colorOptions.length]
                      return (
                        <div
                          key={grade.id}
                          className={cn("rounded-lg border p-4 transition-all", colorConfig.light)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            {isEditingGrades ? (
                              <Input
                                value={grade.grade}
                                onChange={(e) => handleGradeChange(grade.id, "grade", e.target.value)}
                                className="w-20 h-8 text-center font-semibold"
                              />
                            ) : (
                              <span className="text-xl font-bold">{grade.grade}</span>
                            )}
                            <div className={cn("w-4 h-4 rounded-full", grade.color)} />
                          </div>
                          <div className="flex items-center gap-2">
                            {isEditingGrades ? (
                              <>
                                <Input
                                  type="number"
                                  value={grade.minScore}
                                  onChange={(e) => handleGradeChange(grade.id, "minScore", parseInt(e.target.value) || 0)}
                                  className="w-16 h-7 text-center text-sm"
                                  min={0}
                                  max={100}
                                />
                                <span className="text-gray-500">-</span>
                                <Input
                                  type="number"
                                  value={grade.maxScore}
                                  onChange={(e) => handleGradeChange(grade.id, "maxScore", parseInt(e.target.value) || 0)}
                                  className="w-16 h-7 text-center text-sm"
                                  min={0}
                                  max={100}
                                />
                                <span className="text-sm text-gray-500">分</span>
                              </>
                            ) : (
                              <span className="text-sm font-medium">
                                {grade.minScore} - {grade.maxScore} 分
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>

                {/* Score preview */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">分数模拟测试</h4>
                  <div className="flex items-center gap-4 w-full">
                    <Input
                      type="number"
                      value={testScore}
                      onChange={(e) => setTestScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                      className="w-24"
                      min={0}
                      max={100}
                    />
                    <span className="text-gray-500">分 =</span>
                    {getGradeForScore(testScore) ? (
                      <div className={cn("px-4 py-2 rounded-lg font-semibold", getGradeForScore(testScore)!.color, "text-white")}>
                        {getGradeForScore(testScore)!.grade} 等级
                      </div>
                    ) : (
                      <span className="text-gray-400">无匹配等级</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Formula preview */}
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-3">成绩计算公式：</p>
            <div className="p-4 bg-white rounded-lg border border-gray-200 font-mono text-sm">
              总成绩 = {taskWeights.map((t, i) => (
                <span key={t.taskId}>
                  {i > 0 && " + "}
                  <span className="text-primary">{t.taskName}</span>
                  <span className="text-gray-400"> x </span>
                  <span className="text-blue-600">{t.weight}%</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
