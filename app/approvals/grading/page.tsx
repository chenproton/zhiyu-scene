"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  LayoutGrid,
  Layers,
  PenLine,
  Search,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { studentSubmissions, scenarios } from "@/lib/mock-data"

interface ScenarioSummary {
  scenarioId: string
  scenarioName: string
  scenarioCode?: string
  positionName?: string
  batchName?: string
  taskCount: number
  pendingCount: number
  gradedCount: number
  studentCount: number
}

export default function GradingPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const scenarioSummaries = useMemo<ScenarioSummary[]>(() => {
    const map = new Map<string, ScenarioSummary>()

    for (const sub of studentSubmissions) {
      const existing = map.get(sub.scenarioId)
      if (existing) {
        existing.pendingCount += sub.status === "pending" ? 1 : 0
        existing.gradedCount += sub.status === "graded" ? 1 : 0
        const studentIds = new Set(
          studentSubmissions
            .filter((s) => s.scenarioId === sub.scenarioId)
            .map((s) => s.studentId)
        )
        existing.studentCount = studentIds.size
      } else {
        const scenario = scenarios.find((s) => s.id === sub.scenarioId)
        const studentIds = new Set(
          studentSubmissions
            .filter((s) => s.scenarioId === sub.scenarioId)
            .map((s) => s.studentId)
        )
        const taskIds = new Set(
          studentSubmissions
            .filter((s) => s.scenarioId === sub.scenarioId)
            .map((s) => s.taskId)
        )
        map.set(sub.scenarioId, {
          scenarioId: sub.scenarioId,
          scenarioName: sub.scenarioName,
          scenarioCode: scenario?.code,
          positionName: scenario?.positionName,
          batchName: scenario?.batchName,
          taskCount: taskIds.size,
          pendingCount: sub.status === "pending" ? 1 : 0,
          gradedCount: sub.status === "graded" ? 1 : 0,
          studentCount: studentIds.size,
        })
      }
    }

    return Array.from(map.values())
  }, [])

  const filtered = scenarioSummaries.filter(
    (s) =>
      searchQuery === "" ||
      s.scenarioName.includes(searchQuery) ||
      s.scenarioCode?.includes(searchQuery) ||
      s.positionName?.includes(searchQuery)
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">教师端任务评分模拟</h1>
          <p className="text-sm text-gray-500 mt-1">
            选择场景进入，查看该场景下需要评分的任务及学生提交
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/approvals/grading/simulation">
            <GraduationCap className="mr-2 h-4 w-4" />
            学生端任务学习模拟
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索场景名称、代码或岗位..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scenario Cards */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <LayoutGrid className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">暂无评分场景</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery ? "未找到匹配的场景" : "当前没有需要评分的场景数据"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((scenario) => (
            <Link
              key={scenario.scenarioId}
              href={`/approvals/grading/scenario/${scenario.scenarioId}`}
              className="block group"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                          {scenario.scenarioName}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {scenario.scenarioCode || "-"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scenario.positionName && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {scenario.positionName}
                      </Badge>
                    )}
                    {scenario.batchName && (
                      <Badge variant="outline" className="text-xs font-normal text-gray-500">
                        {scenario.batchName}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                        <Layers className="h-3 w-3" />
                        任务数
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{scenario.taskCount}</p>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-2.5">
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-600 mb-1">
                        <PenLine className="h-3 w-3" />
                        待评分
                      </div>
                      <p className="text-lg font-semibold text-amber-700">{scenario.pendingCount}</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-2.5">
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600 mb-1">
                        <CheckCircle2 className="h-3 w-3" />
                        已评分
                      </div>
                      <p className="text-lg font-semibold text-green-700">{scenario.gradedCount}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    参与学生 {scenario.studentCount} 人
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
