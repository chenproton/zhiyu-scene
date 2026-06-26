"use client"

import { useMemo, useState } from "react"
import { Search, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { scenarios, studentHeartScenes as initialHeartScenes } from "@/lib/mock-data"
import type { Scenario, StudentHeartScene } from "@/lib/mock-data"

const CURRENT_STUDENT_ID = "stu-1"

function getViewCount(scenario: Scenario) {
  if (typeof scenario.viewCount === "number") return scenario.viewCount
  let hash = 0
  for (let i = 0; i < scenario.id.length; i++) hash = scenario.id.charCodeAt(i) + ((hash << 5) - hash)
  return 800 + (Math.abs(hash) % 200)
}

function getRelatedScenesCount(scenario: Scenario) {
  if (typeof scenario.relatedScenesCount === "number") return scenario.relatedScenesCount
  return scenarios.filter(
    (s) => s.id !== scenario.id && s.industryName && s.industryName === scenario.industryName
  ).length
}

function formatDate(date?: string) {
  if (!date) return "-"
  return date.replace(/-/g, ".")
}

function getPublishDate(scenario: Scenario) {
  if (scenario.publishTime) return scenario.publishTime.split(" ")[0]
  return scenario.createdAt
}

export default function HeartScenesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string>("全部")
  const [heartScenes] = useState<StudentHeartScene[]>(initialHeartScenes)

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
        activeTag === "全部" || scenario.industryName === activeTag || scenario.professionName === activeTag
      return matchesSearch && matchesTag
    })
  }, [searchQuery, activeTag])

  const rankedScenarios = useMemo(() => {
    return [...scenarios]
      .map((s) => ({ ...s, _viewCount: getViewCount(s) }))
      .sort((a, b) => b._viewCount - a._viewCount)
      .slice(0, 5)
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
                  className="pl-10 max-w-md"
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
              const viewCount = getViewCount(scenario)
              const relatedScenesCount = getRelatedScenesCount(scenario)
              const publishDate = getPublishDate(scenario)
              const coBuilder = scenario.coBuilders?.[0]?.name || "知与未来"
              return (
                <Card
                  key={scenario.id}
                  className="overflow-hidden border-slate-100 transition-all hover:shadow-lg"
                >
                  {/* Banner with cover image */}
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={scenario.coverImage || "/placeholder.svg"}
                      alt={scenario.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80" />
                    <div className="relative z-10 flex h-full flex-col justify-between px-4 pb-4 pt-3 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                            {scenario.version || "v1.0"}
                          </Badge>
                          <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                            {formatDate(publishDate)} 收录
                          </Badge>
                        </div>
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                          已发布
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{scenario.name}</h3>
                        <p className="mt-1 text-xs text-white/80">
                          岗位编码：{scenario.code} · {formatDate(publishDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 py-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{viewCount}</div>
                      <div className="text-xs text-gray-500">浏览次数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{relatedScenesCount}</div>
                      <div className="text-xs text-gray-500">关联场景</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{scenario.tasks.length}</div>
                      <div className="text-xs text-gray-500">场景任务</div>
                    </div>
                  </div>

                  {/* Tags + meta */}
                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-orange-50 text-orange-600 hover:bg-orange-50 text-xs font-normal"
                      >
                        面向行业：{scenario.industryName || "-"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-xs font-normal"
                      >
                        适用专业：{scenario.professionName || "-"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>创建人：{scenario.creatorName || "-"}</span>
                      <span>共建人：{coBuilder}</span>
                      <span>浏览量：{viewCount}</span>
                      <span>更新时间：{formatDate(scenario.updatedAt)}</span>
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
