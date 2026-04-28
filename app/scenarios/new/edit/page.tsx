"use client"

import { ArrowRight, ChevronDown, ChevronRight, Eye, ImagePlus, List, ListOrdered, Save, Search, Star, X, UserPlus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { professions, batches, industries, allTeachers } from "@/lib/mock-data"

// Organize teachers by department
const departments = Array.from(new Set(allTeachers.map(t => t.department)))

const departmentTree = departments.map(dept => ({
  name: dept,
  users: allTeachers.filter(t => t.department === dept),
}))

// Position tab filter type
type PositionTab = "my" | "collab" | "public"

function NewScenarioEditForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const positionIdFromQuery = searchParams.get("positionId")
  const batchIdFromQuery = searchParams.get("batchId")

  // Get position and batch from query params
  const initialPosition = positionIdFromQuery 
    ? professions.flatMap(p => p.positions).find(pos => pos.id === positionIdFromQuery)
    : null
  const initialProfession = initialPosition 
    ? professions.find(p => p.positions.some(pos => pos.id === positionIdFromQuery))
    : null
  const initialBatch = batchIdFromQuery 
    ? batches.find(b => b.id === batchIdFromQuery)
    : null

  // Form state
  const [scenarioName, setScenarioName] = useState("")
  const [scenarioCode] = useState(`SC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`)
  const [positionId, setPositionId] = useState(positionIdFromQuery || "")
  const [batchId, setBatchId] = useState(batchIdFromQuery || "")
  const [industryId, setIndustryId] = useState("")
  const [relatedProfessionId, setRelatedProfessionId] = useState(initialProfession?.id || "")
  const [difficulty, setDifficulty] = useState<number>(3)
  const [background, setBackground] = useState("")
  const [creatorName] = useState("当前用户")
  const [coBuilderIds, setCoBuilderIds] = useState<string[]>([])
  const [version] = useState("v1.0")
  
  // Position selector state
  const [positionTab, setPositionTab] = useState<PositionTab>("my")
  const [positionSearch, setPositionSearch] = useState("")
  const [isPositionPopoverOpen, setIsPositionPopoverOpen] = useState(false)
  
  // Co-builder transfer state
  const [expandedDepts, setExpandedDepts] = useState<string[]>(departments)
  const [coBuilderSearch, setCoBuilderSearch] = useState("")

  // Co-builder dialog
  const [isCoBuilderDialogOpen, setIsCoBuilderDialogOpen] = useState(false)

  // Position filtering
  const allPositions = useMemo(() => {
    return professions.flatMap(prof => 
      prof.positions.map(pos => ({ ...pos, professionName: prof.name, professionId: prof.id }))
    )
  }, [])

  const filteredPositions = useMemo(() => {
    let result = allPositions
    if (positionSearch.trim()) {
      const q = positionSearch.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.professionName.toLowerCase().includes(q))
    }
    return result
  }, [allPositions, positionSearch, positionTab])

  const selectedPosition = allPositions.find(p => p.id === positionId)

  const filteredTeachers = useMemo(() => {
    if (!coBuilderSearch) return allTeachers
    return allTeachers.filter(t => 
      t.name.toLowerCase().includes(coBuilderSearch.toLowerCase()) ||
      t.department.toLowerCase().includes(coBuilderSearch.toLowerCase())
    )
  }, [coBuilderSearch])

  const selectedCoBuilders = allTeachers.filter(t => coBuilderIds.includes(t.id))

  const handleProceed = () => {
    // Generate a new scenario ID and proceed to tasks
    const newScenarioId = `scenario-new-${Date.now()}`
    const params = new URLSearchParams({
      name: scenarioName,
      code: scenarioCode,
      industryId,
      professionId: relatedProfessionId,
      difficulty: String(difficulty),
      background,
    })
    if (positionId) params.set("positionId", positionId)
    if (batchId) params.set("batchId", batchId)
    router.push(`/scenarios/${newScenarioId}/edit/tasks?${params.toString()}`)
  }

  const handleSaveDraft = () => {
    console.log("Saving draft...")
  }

  const handlePreview = () => {
    console.log("Preview scenario...")
  }

  const toggleCoBuilder = (userId: string) => {
    setCoBuilderIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleDept = (dept: string) => {
    setExpandedDepts(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    )
  }

  const handleSelectPosition = (posId: string) => {
    setPositionId(posId)
    const pos = allPositions.find(p => p.id === posId)
    if (pos) {
      setRelatedProfessionId(pos.professionId)
    }
    setIsPositionPopoverOpen(false)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <X className="h-4 w-4 mr-2" />
              取消
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">步骤 1</Badge>
              <span className="text-sm font-medium text-gray-800">基础信息编辑</span>
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
            <Button 
              onClick={handleProceed}
              disabled={!scenarioName || !industryId}
            >
              下一步
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">新建实践场景</h1>
          <p className="text-sm text-gray-500 mt-1">填写场景基础信息，完成后进入任务链配置</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column: Main form */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-5">
                {/* Pre-filled info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-gray-500 text-xs">所属岗位</Label>
                    <p className="font-medium text-gray-800 mt-1">{selectedPosition?.name || initialPosition?.name || "未选择"}</p>
                    <p className="text-xs text-gray-400">{selectedPosition?.professionName || initialProfession?.name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs">所属批次</Label>
                    <p className="font-medium text-gray-800 mt-1">{initialBatch?.name || "未选择"}</p>
                    <p className="text-xs text-gray-400">{initialBatch?.departmentName || "-"}</p>
                  </div>
                </div>

                {/* Scenario name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">场景名称 <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="请输入场景名称"
                  />
                </div>

                {/* Scenario code (auto-generated) */}
                <div className="grid gap-2">
                  <Label htmlFor="code">场景编码</Label>
                  <Input
                    id="code"
                    value={scenarioCode}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-400">系统自动生成，不可修改</p>
                </div>

                {/* Industry and profession - renamed labels */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="industry">面向行业 <span className="text-red-500">*</span></Label>
                    <Select value={industryId} onValueChange={setIndustryId}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="选择行业" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>
                            {ind.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="profession">适用专业</Label>
                    <Select value={relatedProfessionId} onValueChange={setRelatedProfessionId}>
                      <SelectTrigger id="profession">
                        <SelectValue placeholder="选择专业" />
                      </SelectTrigger>
                      <SelectContent>
                        {professions.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id}>
                            {prof.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="grid gap-2">
                  <Label>难度等级</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={cn(
                            "h-6 w-6 transition-colors",
                            level <= difficulty
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200 hover:fill-amber-200 hover:text-amber-200"
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {difficulty === 1 && "入门"}
                      {difficulty === 2 && "基础"}
                      {difficulty === 3 && "中级"}
                      {difficulty === 4 && "高级"}
                      {difficulty === 5 && "专家"}
                    </span>
                  </div>
                </div>

                {/* Background */}
                <div className="grid gap-2">
                  <Label htmlFor="background">场景介绍</Label>
                  <div className="border rounded-lg">
                    <div className="bg-gray-50 border-b px-3 py-2 flex gap-1 items-center">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold">B</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs italic">I</Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs underline">U</Button>
                      <div className="w-px bg-gray-200 mx-1 h-5" />
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <List className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <ListOrdered className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Textarea
                      id="background"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      placeholder="描述该场景的背景、意义和学习目标..."
                      className="border-0 min-h-[200px] focus-visible:ring-0 rounded-t-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Cover and co-builders */}
          <div className="space-y-6">
            {/* Cover image */}
            <Card>
              <CardContent className="pt-6">
                <Label className="mb-3 block">场景封面</Label>
                <div 
                  className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">点击上传封面图片</p>
                  <p className="text-xs text-gray-400 mt-1">建议尺寸 320x200</p>
                </div>
              </CardContent>
            </Card>

            {/* Creator and co-builders */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className="text-gray-500 text-xs">创建人</Label>
                  <p className="font-medium text-gray-800 mt-1">{creatorName}</p>
                </div>

                <div>
                  <Label className="mb-2 block">共建人/共建部门</Label>
                  
                  {/* Selected co-builders compact view */}
                  <div 
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsCoBuilderDialogOpen(true)}
                  >
                    {selectedCoBuilders.length === 0 ? (
                      <div className="flex items-center gap-2 text-gray-400">
                        <UserPlus className="h-4 w-4" />
                        <span className="text-sm">点击选择共建人</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedCoBuilders.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            <span>{user.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleCoBuilder(user.id)
                              }}
                              className="hover:bg-primary/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <Label className="text-gray-500 text-xs">当前版本号</Label>
                  <p className="font-medium text-gray-800 mt-1">{version}</p>
                </div>
              </CardContent>
            </Card>

            {/* Co-builder Dialog */}
            <Dialog open={isCoBuilderDialogOpen} onOpenChange={setIsCoBuilderDialogOpen}>
              <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>选择共建人/共建部门</DialogTitle>
                  <DialogDescription>
                    从组织架构中选择共建人，选中的用户将参与该场景的建设
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden py-4">
                  {/* Shuttle Box */}
                  <div className="border rounded-lg overflow-hidden h-full">
                    {/* Search */}
                    <div className="p-3 border-b bg-gray-50">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="搜索用户或部门..."
                          value={coBuilderSearch}
                          onChange={(e) => setCoBuilderSearch(e.target.value)}
                          className="h-9 pl-8 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 divide-x" style={{ minHeight: 400, maxHeight: 500 }}>
                      {/* Left: Organization tree + users */}
                      <div className="flex flex-col">
                        <div className="px-3 py-2.5 bg-gray-50 border-b text-sm font-medium text-gray-500">
                          组织架构
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                          {departmentTree.map((dept) => {
                            const isExpanded = expandedDepts.includes(dept.name)
                            const deptUsers = filteredTeachers.filter(t => t.department === dept.name)
                            if (deptUsers.length === 0) return null
                            
                            return (
                              <div key={dept.name}>
                                <button
                                  onClick={() => toggleDept(dept.name)}
                                  className="flex items-center gap-1 w-full px-1 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                  )}
                                  {dept.name}
                                  <span className="ml-auto text-xs text-gray-400">{deptUsers.length}</span>
                                </button>
                                {isExpanded && (
                                  <div className="ml-4 space-y-0.5">
                                    {deptUsers.map((user) => (
                                      <div
                                        key={user.id}
                                        onClick={() => toggleCoBuilder(user.id)}
                                        className={cn(
                                          "flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-50",
                                          coBuilderIds.includes(user.id) && "bg-primary/5 text-primary"
                                        )}
                                      >
                                        <div className={cn(
                                          "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                                          coBuilderIds.includes(user.id) ? "bg-primary border-primary" : "border-gray-300"
                                        )}>
                                          {coBuilderIds.includes(user.id) && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </div>
                                        <span className="truncate">{user.name}</span>
                                        <span className="text-xs text-gray-400 ml-auto">{user.role === 'admin' ? '管理员' : user.role === 'reviewer' ? '审批人' : '建设者'}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      
                      {/* Right: Selected co-builders */}
                      <div className="flex flex-col">
                        <div className="px-3 py-2.5 bg-gray-50 border-b text-sm font-medium text-gray-500 flex items-center justify-between">
                          <span>已选共建人</span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{selectedCoBuilders.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                          {selectedCoBuilders.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <UserPlus className="h-8 w-8 mb-2" />
                              <span className="text-sm">从左侧面板选择共建人</span>
                            </div>
                          )}
                          {selectedCoBuilders.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-2 px-2 py-2 rounded text-sm bg-primary/5 text-primary"
                            >
                              <span className="flex-1 truncate">{user.name}</span>
                              <span className="text-xs text-gray-400">{user.department}</span>
                              <button
                                onClick={() => toggleCoBuilder(user.id)}
                                className="ml-1 hover:bg-primary/10 rounded-full p-0.5"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCoBuilderDialogOpen(false)}>
                    完成
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewScenarioEditPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}>
      <NewScenarioEditForm />
    </Suspense>
  )
}
