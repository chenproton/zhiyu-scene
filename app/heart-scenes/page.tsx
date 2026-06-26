"use client"

import { useMemo, useState } from "react"
import {
  Heart,
  Search,
  Briefcase,
  Layers,
  CheckCircle2,
  Bookmark,
  GraduationCap,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  scenarios,
  professions,
  students,
  studentHeartScenes as initialHeartScenes,
} from "@/lib/mock-data"
import type { Scenario, StudentHeartScene } from "@/lib/mock-data"

const CURRENT_STUDENT_ID = "stu-1"
const MAX_HEARTS = 5

export default function HeartScenesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [professionId, setProfessionId] = useState<string>("all")
  const [heartScenes, setHeartScenes] = useState<StudentHeartScene[]>(initialHeartScenes)

  const myHearts = useMemo(
    () => heartScenes.filter((h) => h.studentId === CURRENT_STUDENT_ID).sort((a, b) => a.priority - b.priority),
    [heartScenes]
  )

  const heartScenarioIds = useMemo(() => new Set(myHearts.map((h) => h.scenarioId)), [myHearts])

  const filteredScenarios = useMemo(() => {
    const source = activeTab === "mine" ? scenarios.filter((s) => heartScenarioIds.has(s.id)) : scenarios
    return source.filter((scenario) => {
      if (scenario.status !== "published" && scenario.status !== "approved") return false
      const matchesSearch =
        scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scenario.code?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (scenario.positionName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (scenario.professionName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesProfession = professionId === "all" || scenario.professionId === professionId
      return matchesSearch && matchesProfession
    })
  }, [searchQuery, professionId, activeTab, heartScenarioIds])

  const toggleHeart = (scenario: Scenario) => {
    setHeartScenes((prev) => {
      const exists = prev.find(
        (h) => h.studentId === CURRENT_STUDENT_ID && h.scenarioId === scenario.id
      )
      if (exists) {
        return prev.filter((h) => h.id !== exists.id)
      }
      if (prev.filter((h) => h.studentId === CURRENT_STUDENT_ID).length >= MAX_HEARTS) {
        return prev
      }
      const nextPriority = prev.filter((h) => h.studentId === CURRENT_STUDENT_ID).length + 1
      const newHeart: StudentHeartScene = {
        id: `heart-${Date.now()}`,
        studentId: CURRENT_STUDENT_ID,
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        positionId: scenario.positionId,
        positionName: scenario.positionName,
        professionId: scenario.professionId,
        professionName: scenario.professionName,
        priority: nextPriority,
        status: "draft",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      return [...prev, newHeart]
    })
  }

  const formatDate = (date?: string) => {
    if (!date) return "-"
    return date.replace(/-/g, ".")
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">心仪岗位场景</h1>
        <p className="mt-1 text-sm text-gray-500">
          选择感兴趣的岗位实践场景，系统将据此推荐实训批次并生成个性化学习路径。
        </p>
      </div>

      {/* Tabs + filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Layers className="h-4 w-4" />
              全部场景
            </TabsTrigger>
            <TabsTrigger value="mine" className="gap-2">
              <Heart className="h-4 w-4" />
              我的心仪
              {myHearts.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-primary/10 text-primary">
                  {myHearts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜索场景名称或编码"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Select value={professionId} onValueChange={setProfessionId}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="选择专业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部专业</SelectItem>
                {professions.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <ScenarioList
            scenarios={filteredScenarios}
            myHearts={myHearts}
            heartScenarioIds={heartScenarioIds}
            onToggleHeart={toggleHeart}
            emptyText="未找到匹配场景"
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="mine" className="mt-4">
          {myHearts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <h3 className="text-base font-medium text-gray-700">还没有心仪场景</h3>
                <p className="mt-1 text-sm text-gray-500">在“全部场景”中点击心仪按钮，即可收藏到此列表</p>
                <Button className="mt-4" onClick={() => setActiveTab("all")}>
                  去浏览场景
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ScenarioList
              scenarios={filteredScenarios}
              myHearts={myHearts}
              heartScenarioIds={heartScenarioIds}
              onToggleHeart={toggleHeart}
              emptyText="未找到匹配场景"
              formatDate={formatDate}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ScenarioList({
  scenarios,
  myHearts,
  heartScenarioIds,
  onToggleHeart,
  emptyText,
  formatDate,
}: {
  scenarios: Scenario[]
  myHearts: StudentHeartScene[]
  heartScenarioIds: Set<string>
  onToggleHeart: (scenario: Scenario) => void
  emptyText: string
  formatDate: (date?: string) => string
}) {
  if (scenarios.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <h3 className="text-base font-medium text-gray-700">{emptyText}</h3>
          <p className="mt-1 text-sm text-gray-500">请尝试调整搜索关键词或专业筛选</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {scenarios.map((scenario) => {
        const isHearted = heartScenarioIds.has(scenario.id)
        const heart = myHearts.find((h) => h.scenarioId === scenario.id)
        return (
          <Card
            key={scenario.id}
            className={cn(
              "group overflow-hidden transition-all hover:shadow-md",
              isHearted && "border-primary/30 bg-primary/[0.02]"
            )}
          >
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              {/* Cover */}
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-36">
                <img
                  src={scenario.coverImage || "/placeholder.svg"}
                  alt={scenario.name}
                  className="h-full w-full object-cover"
                />
                {isHearted && (
                  <div className="absolute left-2 top-2">
                    <Badge className="bg-primary text-white hover:bg-primary">
                      <Bookmark className="mr-1 h-3 w-3" />
                      第 {heart?.priority} 志愿
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                    v{scenario.version || "1.0"}
                  </Badge>
                  <span className="text-xs text-gray-400">{formatDate(scenario.createdAt)} 收录</span>
                  <Badge className="bg-green-50 text-green-600 hover:bg-green-50 text-xs font-normal">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    已发布
                  </Badge>
                </div>

                <h3 className="truncate text-base font-semibold text-gray-800">{scenario.name}</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  场景编码：{scenario.code || "-"} · {formatDate(scenario.updatedAt)} 更新
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    任务 {scenario.tasks.length}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {scenario.positionName || "未关联岗位"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {scenario.professionName || "未分类"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <BarChart3 className="h-3.5 w-3.5" />
                    难度 {"★".repeat(scenario.difficulty)}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span>面向行业：{scenario.industryName || "-"}</span>
                  <span>适用专业：{scenario.professionName || "-"}</span>
                  <span>创建人：{scenario.creatorName || "-"}</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex shrink-0 items-center justify-end sm:flex-col sm:items-end sm:gap-2">
                <Button
                  variant={isHearted ? "default" : "outline"}
                  size="sm"
                  className="h-9 gap-1.5"
                  onClick={() => onToggleHeart(scenario)}
                >
                  <Heart className={cn("h-4 w-4", isHearted && "fill-current")} />
                  {isHearted ? "已心仪" : "心仪"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
