"use client"

import { useMemo, useState } from "react"
import {
  Heart,
  Search,
  Flame,
  Eye,
  Briefcase,
  Layers,
  Trophy,
  BarChart3,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { scenarios, professions, studentHeartScenes as initialHeartScenes } from "@/lib/mock-data"
import type { Scenario, StudentHeartScene } from "@/lib/mock-data"

const CURRENT_STUDENT_ID = "stu-1"
const MAX_HEARTS = 5

const BANNER_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-rose-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-red-500",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-pink-600",
  "from-lime-500 to-green-600",
  "from-sky-500 to-indigo-500",
  "from-orange-400 to-rose-500",
  "from-teal-400 to-cyan-600",
  "from-indigo-400 to-violet-600",
]

function getGradientIndex(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % BANNER_GRADIENTS.length
}

function getViewCount(scenario: Scenario) {
  if (typeof scenario.viewCount === "number") return scenario.viewCount
  let hash = 0
  for (let i = 0; i < scenario.id.length; i++) hash = scenario.id.charCodeAt(i) + ((hash << 5) - hash)
  return 800 + (Math.abs(hash) % 200)
}

function formatDate(date?: string) {
  if (!date) return "-"
  return date.replace(/-/g, ".")
}

export default function HeartScenesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string>("全部")
  const [heartScenes, setHeartScenes] = useState<StudentHeartScene[]>(initialHeartScenes)

  const myHearts = useMemo(
    () => heartScenes.filter((h) => h.studentId === CURRENT_STUDENT_ID).sort((a, b) => a.priority - b.priority),
    [heartScenes]
  )

  const heartScenarioIds = useMemo(() => new Set(myHearts.map((h) => h.scenarioId)), [myHearts])

  const allTags = useMemo(() => {
    const industryTags = Array.from(new Set(scenarios.map((s) => s.industryName).filter(Boolean) as string[]))
    const professionTags = Array.from(new Set(scenarios.map((s) => s.professionName).filter(Boolean) as string[]))
    return { industries: industryTags, professions: professionTags }
  }, [])

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      if (scenario.status !== "published" && scenario.status !== "approved") return false
      const matchesSearch =
        scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (scenario.code?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (scenario.positionName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (scenario.professionName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (scenario.industryName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesTag =
        activeTag === "全部" ||
        scenario.industryName === activeTag ||
        scenario.professionName === activeTag
      return matchesSearch && matchesTag
    })
  }, [searchQuery, activeTag])

  const rankedScenarios = useMemo(() => {
    return [...scenarios]
      .map((s) => ({ ...s, _viewCount: getViewCount(s) }))
      .sort((a, b) => b._viewCount - a._viewCount)
      .slice(0, 5)
  }, [])

  const maxViews = useMemo(() => Math.max(...rankedScenarios.map((s) => s._viewCount), 1), [rankedScenarios])

  const toggleHeart = (scenario: Scenario) => {
    setHeartScenes((prev) => {
      const exists = prev.find((h) => h.studentId === CURRENT_STUDENT_ID && h.scenarioId === scenario.id)
      if (exists) return prev.filter((h) => h.id !== exists.id)
      if (prev.filter((h) => h.studentId === CURRENT_STUDENT_ID).length >= MAX_HEARTS) return prev
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

  const removeHeart = (scenarioId: string) => {
    setHeartScenes((prev) => prev.filter((h) => !(h.studentId === CURRENT_STUDENT_ID && h.scenarioId === scenarioId)))
  }

  const hotThreshold = useMemo(() => {
    const counts = scenarios.map(getViewCount).sort((a, b) => b - a)
    return counts[Math.floor(counts.length * 0.3)] || 0
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">我的心仪场景</h1>
        <p className="mt-1 text-sm text-gray-500">管理学生端收藏的心仪场景，支持按行业筛选与搜索</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Main */}
        <div className="space-y-4">
          {/* Search + filters */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="搜索场景名称、编码、行业或专业..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTag("全部")}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    activeTag === "全部"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  全部
                </button>
                {allTags.industries.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      activeTag === tag
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {tag}
                  </button>
                ))}
                {allTags.professions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      activeTag === tag
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-500">共 {filteredScenarios.length} 个场景</div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredScenarios.map((scenario) => {
              const isHearted = heartScenarioIds.has(scenario.id)
              const viewCount = getViewCount(scenario)
              const isHot = viewCount >= hotThreshold
              const gradient = BANNER_GRADIENTS[getGradientIndex(scenario.id)]
              const coBuilder = scenario.coBuilders?.[0]?.name || "知与未来"
              return (
                <Card
                  key={scenario.id}
                  className="overflow-hidden border-slate-100 transition-all hover:shadow-lg"
                >
                  {/* Banner */}
                  <div className={cn("relative bg-gradient-to-br px-4 pb-4 pt-3 text-white", gradient)}>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                          {scenario.version || "v1.0"}
                        </Badge>
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                          {formatDate(scenario.createdAt)} 收录
                        </Badge>
                      </div>
                      {isHot && (
                        <Badge className="bg-red-500/90 text-white hover:bg-red-500 border-none text-[10px] gap-1">
                          <Flame className="h-3 w-3" />
                          热门
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold">{scenario.name}</h3>
                    <p className="mt-1 text-xs text-white/80">
                      场景编码：{scenario.code} · {formatDate(scenario.updatedAt)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 py-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{viewCount}</div>
                      <div className="text-xs text-gray-500">浏览次数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">1</div>
                      <div className="text-xs text-gray-500">关联岗位</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{scenario.tasks.length}</div>
                      <div className="text-xs text-gray-500">场景任务</div>
                    </div>
                  </div>

                  {/* Tags + meta */}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-50 text-xs font-normal">
                        面向行业：{scenario.industryName || "-"}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs font-normal">
                        适用专业：{scenario.professionName || "-"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-500">
                      <span>创建人：{scenario.creatorName || "-"}</span>
                      <span>共建人：{coBuilder}</span>
                      <span>浏览量：{viewCount}</span>
                      <span>更新时间：{formatDate(scenario.updatedAt)}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1 text-sm font-semibold text-red-500">
                        <BarChart3 className="h-4 w-4" />
                        {"★".repeat(scenario.difficulty)} 难度
                      </div>
                      {isHearted ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-red-500 hover:bg-red-50 hover:text-red-600 gap-1"
                          onClick={() => removeHeart(scenario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          移除
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => toggleHeart(scenario)}
                        >
                          <Heart className="h-4 w-4" />
                          心仪
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Sidebar ranking */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800">
                <Trophy className="h-5 w-5 text-yellow-500" />
                心仪场景排行
              </div>
              <p className="mb-4 text-xs text-gray-500">按浏览量排序 TOP5</p>
              <div className="space-y-3">
                {rankedScenarios.map((scenario, index) => {
                  const viewCount = scenario._viewCount
                  const rank = index + 1
                  return (
                    <div key={scenario.id} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          rank <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {rank}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-800">{scenario.name}</div>
                        <div className="text-xs text-gray-500">{scenario.industryName || "-"}</div>
                      </div>
                      <div className="text-xs font-semibold text-red-500">{viewCount}</div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
