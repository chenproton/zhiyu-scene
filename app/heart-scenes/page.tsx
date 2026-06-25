"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Heart,
  Search,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  CheckCircle2,
  Info,
  Sparkles,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  scenarios,
  professions,
  batches,
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
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

  const currentStudent = useMemo(
    () => students.find((s) => s.id === CURRENT_STUDENT_ID) || students[0],
    []
  )

  const myHearts = useMemo(
    () => heartScenes.filter((h) => h.studentId === CURRENT_STUDENT_ID).sort((a, b) => a.priority - b.priority),
    [heartScenes]
  )

  const heartScenarioIds = useMemo(() => new Set(myHearts.map((h) => h.scenarioId)), [myHearts])

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      if (scenario.status !== "published" && scenario.status !== "approved") return false
      const matchesSearch =
        scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scenario.positionName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (scenario.professionName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesProfession = professionId === "all" || scenario.professionId === professionId
      return matchesSearch && matchesProfession
    })
  }, [searchQuery, professionId])

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
      const nextPriority =
        prev.filter((h) => h.studentId === CURRENT_STUDENT_ID).length + 1
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

  const setPriority = (heartId: string, priority: number) => {
    setHeartScenes((prev) =>
      prev.map((h) => (h.id === heartId ? { ...h, priority } : h))
    )
  }

  const handleSubmit = () => {
    setHeartScenes((prev) =>
      prev.map((h) =>
        h.studentId === CURRENT_STUDENT_ID && h.status === "draft"
          ? { ...h, status: "submitted" }
          : h
      )
    )
    setSubmitDialogOpen(false)
  }

  const recommendedBatches = useMemo(() => {
    return batches.filter((b) => b.professionId && myHearts.some((h) => h.professionId === b.professionId))
  }, [myHearts])

  const closedLoopSteps = [
    { label: "选择心仪场景", active: myHearts.length > 0 },
    { label: "提交岗位志愿", active: myHearts.some((h) => h.status !== "draft") },
    { label: "系统/教师匹配", active: myHearts.some((h) => h.status === "matched" || h.status === "confirmed") },
    { label: "进入批次学习", active: myHearts.some((h) => h.status === "confirmed") },
  ]

  const renderScenarioCard = (scenario: Scenario) => {
    const isHearted = heartScenarioIds.has(scenario.id)
    const heart = myHearts.find((h) => h.scenarioId === scenario.id)
    return (
      <Card
        key={scenario.id}
        className={cn(
          "group relative overflow-hidden transition-all hover:shadow-md",
          isHearted && "border-primary/30 bg-primary/[0.02]"
        )}
      >
        <div className="relative h-32 bg-slate-100">
          <img
            src={scenario.coverImage || "/placeholder.svg"}
            alt={scenario.name}
            className="h-full w-full object-cover"
          />
          {isHearted && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-primary text-white hover:bg-primary">
                <Bookmark className="mr-1 h-3 w-3" />
                第 {heart?.priority} 志愿
              </Badge>
            </div>
          )}
          <button
            type="button"
            onClick={() => toggleHeart(scenario)}
            className={cn(
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              isHearted
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white/90 text-slate-400 hover:text-primary hover:bg-white"
            )}
            title={isHearted ? "取消心仪" : "标记为心仪"}
          >
            <Heart className={cn("h-4 w-4", isHearted && "fill-current")} />
          </button>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-medium text-gray-800">{scenario.name}</h3>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs font-normal">
              {scenario.professionName || "未分类"}
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              {scenario.positionName || "未关联岗位"}
            </Badge>
          </div>
          <p className="line-clamp-2 text-xs text-gray-500">{scenario.background}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">难度: {"★".repeat(scenario.difficulty)}</span>
            <Button
              variant={isHearted ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => toggleHeart(scenario)}
            >
              <Heart className={cn("mr-1 h-3 w-3", isHearted && "fill-current")} />
              {isHearted ? "已心仪" : "心仪"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">心仪岗位场景</h1>
          <p className="mt-1 text-sm text-gray-500">
            选择感兴趣的岗位实践场景，系统将据此推荐实训批次并生成个性化学习路径。
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{currentStudent.name}</div>
            <div className="text-xs text-gray-500">{currentStudent.class}</div>
          </div>
        </div>
      </div>

      {/* Closed-loop flow */}
      <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Sparkles className="h-4 w-4 text-primary" />
            岗位场景志愿闭环
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {closedLoopSteps.map((step, index) => (
              <div key={step.label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    step.active
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {step.active ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-current text-[10px]">
                      {index + 1}
                    </span>
                  )}
                  {step.label}
                </div>
                {index < closedLoopSteps.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-4">
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
                    placeholder="搜索场景、岗位、专业…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:w-56"
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
              {filteredScenarios.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <h3 className="text-base font-medium text-gray-700">未找到匹配场景</h3>
                    <p className="mt-1 text-sm text-gray-500">请尝试调整搜索关键词或专业筛选</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredScenarios.map(renderScenarioCard)}
                </div>
              )}
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
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">志愿优先级</CardTitle>
                      <CardDescription>
                        最多可选 {MAX_HEARTS} 个心仪场景，数字越小优先级越高
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {myHearts.map((heart) => (
                        <div
                          key={heart.id}
                          className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {heart.priority}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium text-gray-800">
                              {heart.scenarioName}
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                              <Briefcase className="h-3 w-3" />
                              {heart.positionName || "未关联岗位"}
                              <span className="text-slate-300">|</span>
                              {heart.professionName || "未分类"}
                            </div>
                          </div>
                          <Select
                            value={String(heart.priority)}
                            onValueChange={(v) => setPriority(heart.id, Number(v))}
                          >
                            <SelectTrigger className="h-8 w-24 text-xs">
                              <SelectValue placeholder="优先级" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: myHearts.length }, (_, i) => i + 1).map((n) => (
                                <SelectItem key={n} value={String(n)}>
                                  第 {n} 志愿
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-slate-400 hover:text-red-500"
                            onClick={() =>
                              setHeartScenes((prev) => prev.filter((h) => h.id !== heart.id))
                            }
                          >
                            移除
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setActiveTab("all")}>
                      继续选择
                    </Button>
                    <Button onClick={() => setSubmitDialogOpen(true)}>
                      提交岗位志愿
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: closed-loop insights */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                选择概览
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <div className="text-2xl font-semibold text-primary">{myHearts.length}</div>
                  <div className="text-xs text-gray-500">已选场景</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-center">
                  <div className="text-2xl font-semibold text-primary">
                    {new Set(myHearts.map((h) => h.positionId).filter(Boolean)).size}
                  </div>
                  <div className="text-xs text-gray-500">岗位方向</div>
                </div>
              </div>

              {myHearts.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">覆盖岗位</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(myHearts.map((h) => h.positionName).filter(Boolean))).map(
                      (name) => (
                        <Badge key={name} variant="secondary" className="font-normal">
                          {name}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">选择心仪场景后，这里将展示你的岗位方向分布。</p>
              )}

              {myHearts.some((h) => h.status !== "draft") && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">志愿状态</div>
                  <div className="space-y-1.5">
                    {myHearts.map((heart) => (
                      <div
                        key={heart.id}
                        className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-xs"
                      >
                        <span className="truncate pr-2">{heart.scenarioName}</span>
                        <StatusBadge status={heart.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                推荐实训批次
              </CardTitle>
              <CardDescription>基于你的心仪岗位自动匹配</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedBatches.length === 0 ? (
                <p className="text-sm text-gray-500">选择心仪场景后，将为你推荐相关实训批次。</p>
              ) : (
                recommendedBatches.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/batches`}
                    className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-800">{batch.name}</div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {batch.professionName} · {batch.scenarioCount} 个场景
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/[0.02]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium text-gray-800">闭环说明</div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    1. 学生提交心仪岗位场景志愿；
                    <br />
                    2. 教师或系统根据志愿与批次容量进行匹配；
                    <br />
                    3. 匹配结果自动同步至实训批次；
                    <br />
                    4. 学生按分配结果进入场景化学习。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认提交岗位志愿</DialogTitle>
            <DialogDescription>
              提交后教师将基于你的心仪场景进行批次匹配，提交后仍可继续调整优先级。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {myHearts.map((heart) => (
              <div
                key={heart.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
              >
                <span className="font-medium text-gray-700">{heart.scenarioName}</span>
                <Badge variant="secondary">第 {heart.priority} 志愿</Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              再想想
            </Button>
            <Button onClick={handleSubmit}>确认提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ status }: { status: StudentHeartScene["status"] }) {
  const config = {
    draft: { label: "草稿", className: "bg-slate-100 text-slate-600" },
    submitted: { label: "已提交", className: "bg-blue-50 text-blue-600" },
    matched: { label: "已匹配", className: "bg-yellow-50 text-yellow-600" },
    confirmed: { label: "已确认", className: "bg-green-50 text-green-600" },
  }
  const { label, className } = config[status]
  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  )
}
