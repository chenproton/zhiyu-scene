"use client"

import { useMemo, useState } from "react"
import { Search, Trophy, Heart, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { scenarios, studentHeartScenes as initialHeartScenes } from "@/lib/mock-data"
import type { Scenario, StudentHeartScene } from "@/lib/mock-data"

const CURRENT_STUDENT_ID = "stu-1"
const MAX_HEARTS = 5
const INITIAL_VISIBLE_COUNT = 7

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
]

function getCoverImage(scenario: Scenario) {
  if (scenario.coverImage && !scenario.coverImage.includes("placeholder")) return scenario.coverImage
  let hash = 0
  for (let i = 0; i < scenario.id.length; i++) hash = scenario.id.charCodeAt(i) + ((hash << 5) - hash)
  return UNSPLASH_IMAGES[Math.abs(hash) % UNSPLASH_IMAGES.length]
}

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

type FilterState = {
  industry: string
  profession: string
  position: string
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const visibleOptions = expanded ? options : options.slice(0, INITIAL_VISIBLE_COUNT)
  const hasMore = options.length > INITIAL_VISIBLE_COUNT

  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <div className="mt-1 w-10 shrink-0 text-sm font-medium text-gray-700">{label}</div>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onChange("全部")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === "全部" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          全部
        </button>
        {visibleOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              value === option ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 flex shrink-0 items-center gap-0.5 text-xs text-primary hover:text-primary/80"
        >
          {expanded ? "收起" : "展开"}
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      )}
    </div>
  )
}

export default function HeartScenesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    industry: "全部",
    profession: "全部",
    position: "全部",
  })
  const [heartScenes, setHeartScenes] = useState<StudentHeartScene[]>(initialHeartScenes)

  const myHearts = useMemo(
    () => heartScenes.filter((h) => h.studentId === CURRENT_STUDENT_ID).sort((a, b) => a.priority - b.priority),
    [heartScenes]
  )

  const heartScenarioIds = useMemo(() => new Set(myHearts.map((h) => h.scenarioId)), [myHearts])

  const filterOptions = useMemo(() => {
    const industries = Array.from(new Set(scenarios.map((s) => s.industryName).filter(Boolean) as string[]))
    const professions = Array.from(new Set(scenarios.map((s) => s.professionName).filter(Boolean) as string[]))
    const positions = Array.from(new Set(scenarios.map((s) => s.positionName).filter(Boolean) as string[]))
    return { industries, professions, positions }
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
      const matchesIndustry = filters.industry === "全部" || scenario.industryName === filters.industry
      const matchesProfession = filters.profession === "全部" || scenario.professionName === filters.profession
      const matchesPosition = filters.position === "全部" || scenario.positionName === filters.position
      return matchesSearch && matchesIndustry && matchesProfession && matchesPosition
    })
  }, [searchQuery, filters])

  const rankedScenarios = useMemo(() => {
    return [...scenarios]
      .map((s) => ({ ...s, _viewCount: getViewCount(s) }))
      .sort((a, b) => b._viewCount - a._viewCount)
      .slice(0, 5)
  }, [])

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

  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">我的心仪场景</h1>
        <p className="mt-1 text-sm text-gray-500">管理学生端收藏的心仪场景，支持按行业筛选与搜索</p>
      </div>

      {/* Search + filters - full width */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索场景名称、编码、行业或专业..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <FilterRow
            label="行业"
            options={filterOptions.industries}
            value={filters.industry}
            onChange={(value) => setFilters((prev) => ({ ...prev, industry: value }))}
          />
          <FilterRow
            label="专业"
            options={filterOptions.professions}
            value={filters.profession}
            onChange={(value) => setFilters((prev) => ({ ...prev, profession: value }))}
          />
          <FilterRow
            label="岗位"
            options={filterOptions.positions}
            value={filters.position}
            onChange={(value) => setFilters((prev) => ({ ...prev, position: value }))}
          />
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500">共 {filteredScenarios.length} 个场景</div>

      {/* Main grid: cards + sidebar ranking aligned top */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredScenarios.map((scenario) => {
            const isHearted = heartScenarioIds.has(scenario.id)
            const viewCount = getViewCount(scenario)
            const relatedScenesCount = getRelatedScenesCount(scenario)
            const publishDate = getPublishDate(scenario)
            const coBuilder = scenario.coBuilders?.[0]?.name || "知与未来"
            const coverImage = getCoverImage(scenario)
            return (
              <Card
                key={scenario.id}
                className="group overflow-hidden border-slate-100 transition-all hover:shadow-lg"
              >
                {/* Banner with cover image */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={coverImage}
                    alt={scenario.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/80" />
                  <div className="relative z-10 flex h-full flex-col justify-between px-3 pb-3 pt-3 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                          {scenario.version || "v1.0"}
                        </Badge>
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                          {formatDate(publishDate)} 收录
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleHeart(scenario)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                          title={isHearted ? "取消心仪" : "设为心仪"}
                        >
                          <Heart className={cn("h-3.5 w-3.5", isHearted && "fill-current text-red-300")} />
                        </button>
                        <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                          已发布
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold line-clamp-1">{scenario.name}</h3>
                      <p className="mt-1 text-xs text-white/80 line-clamp-1">
                        岗位编码：{scenario.code} · {formatDate(publishDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 py-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{viewCount}</div>
                    <div className="text-xs text-gray-500">浏览次数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{relatedScenesCount}</div>
                    <div className="text-xs text-gray-500">关联场景</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800">{scenario.tasks.length}</div>
                    <div className="text-xs text-gray-500">场景任务</div>
                  </div>
                </div>

                {/* Tags + meta */}
                <CardContent className="p-3 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="secondary"
                      className="bg-orange-50 text-orange-600 hover:bg-orange-50 text-[10px] font-normal"
                    >
                      面向行业：{scenario.industryName || "-"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-50 text-[10px] font-normal"
                    >
                      适用专业：{scenario.professionName || "-"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-500">
                    <span className="truncate">创建人：{scenario.creatorName || "-"}</span>
                    <span className="truncate">共建人：{coBuilder}</span>
                    <span className="truncate">浏览量：{viewCount}</span>
                    <span className="truncate">更新时间：{formatDate(scenario.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sidebar ranking - aligned with first row */}
        <div className="self-start">
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
