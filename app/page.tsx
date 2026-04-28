"use client"

import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FolderKanban,
  GitBranch,
  LayoutList,
  Layers3,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { ProfessionTree } from "@/components/scenarios/profession-tree"
import { ScenarioList } from "@/components/scenarios/scenario-list"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  professions,
  scenarios as initialScenarios,
  batches as initialBatches,
  approvalWorkflows,
} from "@/lib/mock-data"
import type { Scenario } from "@/lib/mock-data"

const CURRENT_USER_ID = "user-1"

type TabType = "my" | "collab" | "public"
type ViewMode = "list" | "group"
type PositionTab = "my" | "collab" | "public"

export default function SceneHallPage() {
  const router = useRouter()

  // Local state for scenarios and batches
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios)
  const [localBatches, setLocalBatches] = useState(initialBatches)

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>("my")

  // Filters
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)
  const [searchName, setSearchName] = useState("")
  const [searchCode, setSearchCode] = useState("")
  const [searchTaskName, setSearchTaskName] = useState("")
  const [searchBatchName, setSearchBatchName] = useState("")

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Expanded batches
  const [expandedBatches, setExpandedBatches] = useState<string[]>(localBatches.map((b) => b.id))

  // Dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createPositionId, setCreatePositionId] = useState<string>("")
  const [createBatchId, setCreateBatchId] = useState<string>("")

  // Create dialog position selector state
  const [createPositionTab, setCreatePositionTab] = useState<PositionTab>("my")
  const [createPositionSearch, setCreatePositionSearch] = useState("")
  const [isCreatePositionPopoverOpen, setIsCreatePositionPopoverOpen] = useState(false)

  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false)
  const [newBatchName, setNewBatchName] = useState("")
  const [newBatchDepartment, setNewBatchDepartment] = useState("")
  const [newBatchProfession, setNewBatchProfession] = useState("")
  const [newBatchWorkflow, setNewBatchWorkflow] = useState("")

  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [approvalScenario, setApprovalScenario] = useState<Scenario | null>(null)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>("")

  // Import/Export dialogs
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isResourceImportDialogOpen, setIsResourceImportDialogOpen] = useState(false)
  const [isBatchMoveDialogOpen, setIsBatchMoveDialogOpen] = useState(false)
  const [isApprovalWorkflowDialogOpen, setIsApprovalWorkflowDialogOpen] = useState(false)

  // Toggle batch expansion
  const toggleBatch = (batchId: string) => {
    setExpandedBatches((prev) =>
      prev.includes(batchId) ? prev.filter((id) => id !== batchId) : [...prev, batchId]
    )
  }

  // Filter by tab
  const tabFilteredScenarios = useMemo(() => {
    switch (activeTab) {
      case "my":
        return scenarios.filter((s) => s.creatorId === CURRENT_USER_ID)
      case "collab":
        return scenarios.filter(
          (s) => s.coBuilders.some((c) => c.id === CURRENT_USER_ID)
        )
      case "public":
      default:
        return scenarios
    }
  }, [scenarios, activeTab])

  // Apply position filter (only in public tab)
  const positionFilteredScenarios = useMemo(() => {
    if (activeTab !== "public" || !selectedPositionId) return tabFilteredScenarios
    return tabFilteredScenarios.filter((s) => s.positionId === selectedPositionId)
  }, [tabFilteredScenarios, activeTab, selectedPositionId])

  // Apply all filters
  const filteredScenarios = useMemo(() => {
    let result = positionFilteredScenarios
    if (searchName) {
      result = result.filter((s) => s.name.toLowerCase().includes(searchName.toLowerCase()))
    }
    if (searchCode) {
      result = result.filter((s) => s.code.toLowerCase().includes(searchCode.toLowerCase()))
    }
    if (searchTaskName) {
      result = result.filter((s) =>
        s.tasks.some((t) => t.name.toLowerCase().includes(searchTaskName.toLowerCase()))
      )
    }
    if (searchBatchName) {
      result = result.filter((s) =>
        s.batchName?.toLowerCase().includes(searchBatchName.toLowerCase())
      )
    }
    if (selectedBatchId) {
      result = result.filter((s) => s.batchId === selectedBatchId)
    }
    return result
  }, [positionFilteredScenarios, searchName, searchCode, searchTaskName, searchBatchName, selectedBatchId])

  // Stats
  const stats = useMemo(() => {
    const total = filteredScenarios.length
    const building = filteredScenarios.filter((s) => s.status === "draft" || s.status === "rejected").length
    const pending = filteredScenarios.filter((s) => s.status === "pending").length
    const published = filteredScenarios.filter((s) => s.status === "published").length
    return { total, building, pending, published }
  }, [filteredScenarios])

  // Group scenarios by batch (for group view)
  const scenariosByBatch = useMemo(() => {
    if (viewMode !== "group") return null
    const groups: Record<string, Scenario[]> = {}
    filteredScenarios.forEach((s) => {
      if (!s.batchId) return
      if (!groups[s.batchId]) groups[s.batchId] = []
      groups[s.batchId].push(s)
    })
    return groups
  }, [filteredScenarios, viewMode])

  // Draft scenarios (no batch)
  const draftScenarios = useMemo(
    () => filteredScenarios.filter((s) => !s.batchId),
    [filteredScenarios]
  )

  const selectedPosition = selectedPositionId
    ? professions.flatMap((p) => p.positions).find((pos) => pos.id === selectedPositionId)
    : null

  const selectedBatch = selectedBatchId
    ? localBatches.find((b) => b.id === selectedBatchId)
    : null

  const openBatches = localBatches.filter((b) => b.status === "open")

  const handlePositionSelect = (positionId: string | null) => {
    setSelectedPositionId(positionId)
    if (positionId) setSelectedBatchId(null)
  }

  const handleOpenCreateDialog = () => {
    if (selectedPositionId && selectedPositionId !== "__draft__") {
      setCreatePositionId(selectedPositionId)
    }
    setIsCreateDialogOpen(true)
  }

  const handleProceedToEditor = () => {
    const params = new URLSearchParams()
    if (createPositionId) params.set("positionId", createPositionId)
    if (createBatchId) params.set("batchId", createBatchId)
    router.push(`/scenarios/new/edit?${params.toString()}`)
  }

  const getPositionProfession = (positionId: string) => {
    for (const prof of professions) {
      const pos = prof.positions.find((p) => p.id === positionId)
      if (pos) return prof
    }
    return null
  }

  // Create dialog position selector logic
  const allPositions = useMemo(() => {
    return professions.flatMap(prof =>
      prof.positions.map(pos => ({ ...pos, professionName: prof.name, professionId: prof.id }))
    )
  }, [])

  const filteredPositions = useMemo(() => {
    let result = allPositions
    if (createPositionSearch.trim()) {
      const q = createPositionSearch.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.professionName.toLowerCase().includes(q))
    }
    return result
  }, [allPositions, createPositionSearch])

  const selectedPositionForCreate = allPositions.find(p => p.id === createPositionId)

  const handleSelectPositionForCreate = (posId: string) => {
    setCreatePositionId(posId)
    setIsCreatePositionPopoverOpen(false)
  }

  // Selection handlers
  const handleSelectId = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((sid) => sid !== id)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredScenarios.map((s) => s.id))
    } else {
      setSelectedIds([])
    }
  }

  // Batch operations
  const handleBatchDelete = () => {
    setScenarios((prev) => prev.filter((s) => !selectedIds.includes(s.id)))
    setSelectedIds([])
  }

  const handleBatchExport = () => {
    setIsExportDialogOpen(true)
    setSelectedIds([])
  }

  const handleBatchMove = () => {
    setIsBatchMoveDialogOpen(true)
  }

  // Clone scenario
  const handleClone = (scenario: Scenario) => {
    const newScenario: Scenario = {
      ...scenario,
      id: `scenario-${Date.now()}`,
      code: `SC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
      name: `${scenario.name} (克隆)`,
      status: "draft",
      version: "v1.0",
      tasks: scenario.tasks.map((t) => ({
        ...t,
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        code: `T-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`,
      })),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setScenarios((prev) => [...prev, newScenario])
  }

  // Delete scenario
  const handleDelete = (scenario: Scenario) => {
    setScenarios((prev) => prev.filter((s) => s.id !== scenario.id))
  }

  // Submit approval
  const handleSubmitApproval = (scenario: Scenario) => {
    if (scenario.batchId) {
      setScenarios((prev) =>
        prev.map((s) => (s.id === scenario.id ? { ...s, status: "pending" as const } : s))
      )
    } else {
      setApprovalScenario(scenario)
      setSelectedWorkflowId("")
      setIsApprovalDialogOpen(true)
    }
  }

  const handleConfirmApproval = () => {
    if (!approvalScenario || !selectedWorkflowId) return
    setScenarios((prev) =>
      prev.map((s) => (s.id === approvalScenario.id ? { ...s, status: "pending" as const } : s))
    )
    setIsApprovalDialogOpen(false)
    setApprovalScenario(null)
    setSelectedWorkflowId("")
  }

  // Withdraw approval
  const handleWithdrawApproval = (scenario: Scenario) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === scenario.id ? { ...s, status: "draft" as const } : s))
    )
  }

  // Add batch
  const handleAddBatch = () => {
    if (!newBatchName || !newBatchDepartment) return
    const deptMap: Record<string, string> = {
      "dept-1": "信息工程系",
      "dept-2": "经济管理系",
      "dept-3": "艺术设计系",
    }
    const newBatch = {
      id: `batch-${Date.now()}`,
      name: newBatchName,
      departmentId: newBatchDepartment,
      departmentName: deptMap[newBatchDepartment] || newBatchDepartment,
      professionId: newBatchProfession || undefined,
      professionName: newBatchProfession
        ? professions.find((p) => p.id === newBatchProfession)?.name
        : undefined,
      workflowId: newBatchWorkflow || "",
      workflowName: newBatchWorkflow
        ? approvalWorkflows.find((w) => w.id === newBatchWorkflow)?.name || ""
        : "",
      status: "open" as const,
      scenarioCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setLocalBatches((prev) => [...prev, newBatch])
    setNewBatchName("")
    setNewBatchDepartment("")
    setNewBatchProfession("")
    setNewBatchWorkflow("")
  }

  const hasSelected = selectedIds.length > 0

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as TabType); setSelectedIds([]); setSelectedPositionId(null); setSelectedBatchId(null) }}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="my">我的</TabsTrigger>
          <TabsTrigger value="collab">共建</TabsTrigger>
          <TabsTrigger value="public">公共库</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">总收录场景数</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Layers3 className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">建设中</p>
              <p className="text-xl font-bold text-slate-900">{stats.building}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">待审批</p>
              <p className="text-xl font-bold text-slate-900">{stats.pending}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center">
              <SlidersHorizontal className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">已发布</p>
              <p className="text-xl font-bold text-slate-900">{stats.published}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
              <GitBranch className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left sidebar - only in public tab */}
        {activeTab === "public" && (
          <Card className="overflow-hidden border-slate-200 shadow-sm h-fit">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers3 className="h-4 w-4 text-primary" />
                岗位目录
              </CardTitle>
              <CardDescription>按专业筛选目标岗位，快速定位对应实践场景。</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ProfessionTree
                professions={professions}
                scenarios={scenarios}
                selectedPositionId={selectedPositionId}
                onSelectPosition={handlePositionSelect}
              />
            </CardContent>
          </Card>
        )}

        <div className={cn("min-w-0 space-y-4", activeTab !== "public" && "xl:col-span-2")}>
          {/* Filters and Actions */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5">
              {/* Top row: title + view toggle + buttons */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {activeTab === "my" ? "我的场景" : activeTab === "collab" ? "共建场景" : selectedPosition ? selectedPosition.name : selectedBatch ? selectedBatch.name : "全部场景"}
                    </h2>
                    {selectedBatch && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-slate-200"
                        onClick={() => setSelectedBatchId(null)}
                      >
                        {selectedBatch.name}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    共 {filteredScenarios.length} 个实践场景
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View mode toggle */}
                  <div className="flex items-center border rounded-md overflow-hidden mr-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors",
                        viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <LayoutList className="h-3.5 w-3.5" />
                      列表展示
                    </button>
                    <button
                      onClick={() => setViewMode("group")}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition-colors",
                        viewMode === "group" ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      分组展示
                    </button>
                  </div>

                  {/* Import */}
                  <Button variant="outline" size="sm" className="text-slate-600" onClick={() => setIsImportDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    导入
                  </Button>

                  {/* Batch actions - only when selected */}
                  {hasSelected && (
                    <>
                      <Button variant="outline" size="sm" className="text-slate-600" onClick={handleBatchExport}>
                        <Download className="mr-2 h-4 w-4" />
                        批量导出
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={handleBatchDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        批量删除
                      </Button>
                      <Button variant="outline" size="sm" className="text-slate-600" onClick={handleBatchMove}>
                        <FolderKanban className="mr-2 h-4 w-4" />
                        批量移动
                      </Button>
                    </>
                  )}

                  {/* Resource import */}
                  <Button variant="outline" size="sm" className="text-slate-600" onClick={() => setIsResourceImportDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    资源包导入
                  </Button>

                  {/* Config approval workflow */}
                  <Button variant="outline" size="sm" className="text-slate-600" onClick={() => setIsApprovalWorkflowDialogOpen(true)}>
                    <GitBranch className="mr-2 h-4 w-4" />
                    配置审批流程
                  </Button>

                  {/* Batch config */}
                  <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-slate-600">
                        <FolderKanban className="mr-2 h-4 w-4" />
                        配置批次
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
                      <DialogHeader>
                        <DialogTitle>批次管理</DialogTitle>
                        <DialogDescription>管理场景建设批次，关联审批流程</DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto py-4 space-y-4">
                        <div className="rounded-lg border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>批次名称</TableHead>
                                <TableHead>院系</TableHead>
                                <TableHead>审批流程</TableHead>
                                <TableHead>状态</TableHead>
                                <TableHead className="w-12"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {localBatches.map((batch) => (
                                <TableRow key={batch.id}>
                                  <TableCell className="font-medium text-sm">{batch.name}</TableCell>
                                  <TableCell className="text-sm">{batch.departmentName}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                      {batch.workflowName || "-"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="secondary"
                                      className={
                                        batch.status === "open"
                                          ? "bg-green-50 text-green-600 text-xs"
                                          : "bg-gray-100 text-gray-500 text-xs"
                                      }
                                    >
                                      {batch.status === "open" ? "开放中" : "已截稿"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Pencil className="mr-2 h-4 w-4" />
                                          编辑
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          删除
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <div className="border rounded-lg p-4 space-y-3">
                          <p className="text-sm font-medium">新建批次</p>
                          <div className="grid gap-2">
                            <Label htmlFor="batchName">批次名称</Label>
                            <Input
                              id="batchName"
                              value={newBatchName}
                              onChange={(e) => setNewBatchName(e.target.value)}
                              placeholder="例如：2026春季电商实训场景开发"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="department">所属院系</Label>
                              <Select value={newBatchDepartment} onValueChange={setNewBatchDepartment}>
                                <SelectTrigger id="department">
                                  <SelectValue placeholder="选择院系" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="dept-1">信息工程系</SelectItem>
                                  <SelectItem value="dept-2">经济管理系</SelectItem>
                                  <SelectItem value="dept-3">艺术设计系</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="profession">专业方向</Label>
                              <Select value={newBatchProfession} onValueChange={setNewBatchProfession}>
                                <SelectTrigger id="profession">
                                  <SelectValue placeholder="选择专业（可选）" />
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
                          <div className="grid gap-2">
                            <Label htmlFor="workflow">关联审批流</Label>
                            <Select value={newBatchWorkflow} onValueChange={setNewBatchWorkflow}>
                              <SelectTrigger id="workflow">
                                <SelectValue placeholder="选择审批流程（可选）" />
                              </SelectTrigger>
                              <SelectContent>
                                {approvalWorkflows.map((wf) => (
                                  <SelectItem key={wf.id} value={wf.id}>
                                    <span>{wf.name}</span>
                                    <span className="text-xs text-gray-400 ml-2">({wf.steps.length}步)</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            size="sm"
                            onClick={handleAddBatch}
                            disabled={!newBatchName || !newBatchDepartment}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            创建批次
                          </Button>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsBatchDialogOpen(false)}>
                          关闭
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Create scenario */}
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleOpenCreateDialog}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        新建场景
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle>新建实践场景</DialogTitle>
                        <DialogDescription>
                          选择目标岗位和所属批次（可选），然后进入场景编辑页面。
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="position">目标岗位</Label>
                          <div className="relative">
                            <button
                              type="button"
                              id="position"
                              onClick={() => setIsCreatePositionPopoverOpen(!isCreatePositionPopoverOpen)}
                              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <span className={selectedPositionForCreate ? "text-foreground" : "text-muted-foreground"}>
                                {selectedPositionForCreate ? `${selectedPositionForCreate.name} (${selectedPositionForCreate.professionName})` : "请选择岗位（可选）"}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>

                            {isCreatePositionPopoverOpen && (
                              <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                                <div className="p-2">
                                  <Tabs value={createPositionTab} onValueChange={(v) => setCreatePositionTab(v as PositionTab)}>
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="my">我的</TabsTrigger>
                                      <TabsTrigger value="collab">共建</TabsTrigger>
                                      <TabsTrigger value="public">公共库</TabsTrigger>
                                    </TabsList>
                                  </Tabs>
                                  <div className="mt-2 relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                    <Input
                                      placeholder="搜索岗位名称..."
                                      value={createPositionSearch}
                                      onChange={(e) => setCreatePositionSearch(e.target.value)}
                                      className="h-8 pl-7 text-sm"
                                    />
                                  </div>
                                  <div className="mt-2 max-h-[200px] overflow-y-auto">
                                    {professions.map((prof) => {
                                      const profPositions = filteredPositions.filter(p => p.professionId === prof.id)
                                      if (profPositions.length === 0) return null
                                      return (
                                        <div key={prof.id}>
                                          <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50">
                                            {prof.name}
                                          </div>
                                          {profPositions.map((pos) => (
                                            <div
                                              key={pos.id}
                                              onClick={() => handleSelectPositionForCreate(pos.id)}
                                              className={cn(
                                                "px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-50 flex items-center justify-between",
                                                createPositionId === pos.id && "bg-primary/5 text-primary"
                                              )}
                                            >
                                              <span>{pos.name}</span>
                                              {createPositionId === pos.id && (
                                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="batch">所属批次</Label>
                          <Select value={createBatchId} onValueChange={setCreateBatchId}>
                            <SelectTrigger id="batch">
                              <SelectValue placeholder="请选择批次（可选）" />
                            </SelectTrigger>
                            <SelectContent>
                              {openBatches.length > 0 ? (
                                openBatches.map((batch) => (
                                  <SelectItem key={batch.id} value={batch.id}>
                                    <span className="flex items-center gap-2">
                                      {batch.name}
                                      <span className="text-xs text-gray-400">({batch.departmentName})</span>
                                    </span>
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-4 text-sm text-gray-500 text-center">
                                  暂无开放中的批次
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          {createPositionId && (
                            <p className="text-xs text-gray-500">
                              所选岗位所属专业：{getPositionProfession(createPositionId)?.name || "-"}
                            </p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleProceedToEditor}>下一步</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Filter row */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-500">筛选：</span>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-slate-400">场景名称</Label>
                  <Input
                    placeholder="搜索场景名称"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="h-8 text-sm w-40"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-slate-400">场景编码</Label>
                  <Input
                    placeholder="搜索编码"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="h-8 text-sm w-32"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-slate-400">任务名称</Label>
                  <Input
                    placeholder="搜索任务"
                    value={searchTaskName}
                    onChange={(e) => setSearchTaskName(e.target.value)}
                    className="h-8 text-sm w-40"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-slate-400">批次名称</Label>
                  <Input
                    placeholder="搜索批次"
                    value={searchBatchName}
                    onChange={(e) => setSearchBatchName(e.target.value)}
                    className="h-8 text-sm w-40"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-slate-400">所属岗位</Label>
                  <Select value={selectedPositionId || "__all__"} onValueChange={(v) => handlePositionSelect(v === "__all__" ? null : v)}>
                    <SelectTrigger className="h-8 text-sm w-40">
                      <SelectValue placeholder="全部岗位" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">全部岗位</SelectItem>
                      {professions.map((prof) => (
                        <div key={prof.id}>
                          <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50">{prof.name}</div>
                          {prof.positions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-slate-400">批次筛选</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-slate-600 w-32">
                        <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                        {selectedBatchId ? localBatches.find(b => b.id === selectedBatchId)?.name || "已选批次" : "全部批次"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuCheckboxItem
                        checked={!selectedBatchId}
                        onCheckedChange={() => setSelectedBatchId(null)}
                      >
                        全部批次
                      </DropdownMenuCheckboxItem>
                      {localBatches.map((batch) => (
                        <DropdownMenuCheckboxItem
                          key={batch.id}
                          checked={selectedBatchId === batch.id}
                          onCheckedChange={() => setSelectedBatchId(batch.id)}
                        >
                          <span className="flex items-center gap-2">
                            {batch.name}
                            <Badge
                              variant="outline"
                              className={
                                batch.status === "open"
                                  ? "text-green-600 border-green-200"
                                  : "text-gray-400"
                              }
                            >
                              {batch.status === "open" ? "开放中" : "已截稿"}
                            </Badge>
                          </span>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario list */}
          {filteredScenarios.length > 0 ? (
            <>
              {viewMode === "group" && scenariosByBatch ? (
                <div className="space-y-4">
                  {Object.entries(scenariosByBatch).map(([batchId, batchScenarios]) => {
                    const batch = localBatches.find((b) => b.id === batchId)
                    if (!batch) return null
                    const isExpanded = expandedBatches.includes(batchId)

                    return (
                      <Collapsible
                        key={batchId}
                        open={isExpanded}
                        onOpenChange={() => toggleBatch(batchId)}
                      >
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                          <CollapsibleTrigger asChild>
                            <div className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-slate-50">
                              <div className="flex items-center gap-3">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="font-medium text-gray-800">{batch.name}</span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    batch.status === "open"
                                      ? "text-green-600 border-green-200"
                                      : "text-gray-400"
                                  )}
                                >
                                  {batch.status === "open" ? "开放中" : "已截稿"}
                                </Badge>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {batchScenarios.length} 个场景
                              </Badge>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-4 pt-0">
                              <ScenarioList
                                scenarios={batchScenarios}
                                selectedIds={selectedIds}
                                onSelectId={handleSelectId}
                                onSelectAll={handleSelectAll}
                                onClone={handleClone}
                                onDelete={handleDelete}
                                onSubmitApproval={handleSubmitApproval}
                                onWithdrawApproval={handleWithdrawApproval}
                              />
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    )
                  })}
                  {/* Draft scenarios at the bottom */}
                  {draftScenarios.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-white">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-800">草稿场景</span>
                          <Badge variant="secondary" className="text-xs">
                            {draftScenarios.length} 个场景
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <ScenarioList
                          scenarios={draftScenarios}
                          selectedIds={selectedIds}
                          onSelectId={handleSelectId}
                          onSelectAll={handleSelectAll}
                          onClone={handleClone}
                          onDelete={handleDelete}
                          onSubmitApproval={handleSubmitApproval}
                          onWithdrawApproval={handleWithdrawApproval}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <ScenarioList
                  scenarios={filteredScenarios}
                  selectedIds={selectedIds}
                  onSelectId={handleSelectId}
                  onSelectAll={handleSelectAll}
                  onClone={handleClone}
                  onDelete={handleDelete}
                  onSubmitApproval={handleSubmitApproval}
                  onWithdrawApproval={handleWithdrawApproval}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <SlidersHorizontal className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-700">暂无场景</h3>
              <p className="mb-4 text-sm text-slate-500">当前筛选条件下没有实践场景</p>
              <Button size="sm" onClick={handleOpenCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                新建场景
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Approval workflow selection dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>选择审批流程</DialogTitle>
            <DialogDescription>
              当前场景未关联批次，请手动选择一个审批流程。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workflowSelect">审批流程</Label>
              <Select value={selectedWorkflowId} onValueChange={setSelectedWorkflowId}>
                <SelectTrigger id="workflowSelect">
                  <SelectValue placeholder="请选择审批流程" />
                </SelectTrigger>
                <SelectContent>
                  {approvalWorkflows.map((wf) => (
                    <SelectItem key={wf.id} value={wf.id}>
                      <div className="flex items-center gap-2">
                        <span>{wf.name}</span>
                        <span className="text-xs text-gray-400">({wf.steps.length}步)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {approvalScenario && (
              <div className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="text-slate-500">提交场景</p>
                <p className="font-medium text-slate-900 mt-1">{approvalScenario.name}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmApproval} disabled={!selectedWorkflowId}>
              提交审批
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>导入场景</DialogTitle>
            <DialogDescription>上传 Excel 或 JSON 文件批量导入场景数据</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <Upload className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-600 font-medium">点击或拖拽文件到此处上传</p>
              <p className="text-xs text-slate-400 mt-1">支持 .xlsx, .json 格式，单个文件不超过 10MB</p>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-medium mb-1">导入说明</p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li>请使用标准模板格式导入</li>
                <li>场景编码将自动生成</li>
                <li>重复场景名称将被跳过</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>取消</Button>
            <Button onClick={() => setIsImportDialogOpen(false)}>开始导入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>批量导出场景</DialogTitle>
            <DialogDescription>已选择 {selectedIds.length} 个场景，请选择导出格式</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
              <div className="h-10 w-10 rounded bg-green-50 flex items-center justify-center">
                <span className="text-xs font-bold text-green-600">XLSX</span>
              </div>
              <div>
                <p className="text-sm font-medium">导出为 Excel</p>
                <p className="text-xs text-slate-400">包含场景基础信息和任务配置</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
              <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">JSON</span>
              </div>
              <div>
                <p className="text-sm font-medium">导出为 JSON</p>
                <p className="text-xs text-slate-400">完整的场景数据结构，适用于备份和迁移</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>取消</Button>
            <Button onClick={() => setIsExportDialogOpen(false)}>确认导出</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Import Dialog */}
      <Dialog open={isResourceImportDialogOpen} onOpenChange={setIsResourceImportDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>资源包导入</DialogTitle>
            <DialogDescription>导入包含场景、任务和资源的完整资源包</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <Upload className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-600 font-medium">点击或拖拽资源包到此处上传</p>
              <p className="text-xs text-slate-400 mt-1">支持 .zip, .rar 格式</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResourceImportDialogOpen(false)}>取消</Button>
            <Button onClick={() => setIsResourceImportDialogOpen(false)}>开始导入</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Move Dialog */}
      <Dialog open={isBatchMoveDialogOpen} onOpenChange={setIsBatchMoveDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>批量移动场景</DialogTitle>
            <DialogDescription>将已选择的 {selectedIds.length} 个场景移动到其他批次</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="targetBatch">目标批次</Label>
              <Select>
                <SelectTrigger id="targetBatch">
                  <SelectValue placeholder="请选择目标批次" />
                </SelectTrigger>
                <SelectContent>
                  {localBatches.filter(b => b.status === "open").map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchMoveDialogOpen(false)}>取消</Button>
            <Button onClick={() => { setIsBatchMoveDialogOpen(false); setSelectedIds([]) }}>确认移动</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Workflow Config Dialog */}
      <Dialog open={isApprovalWorkflowDialogOpen} onOpenChange={setIsApprovalWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>配置审批流程</DialogTitle>
            <DialogDescription>为场景配置审批流程规则</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="workflowSelect">选择审批流程</Label>
              <Select>
                <SelectTrigger id="workflowSelect">
                  <SelectValue placeholder="请选择审批流程" />
                </SelectTrigger>
                <SelectContent>
                  {approvalWorkflows.map((wf) => (
                    <SelectItem key={wf.id} value={wf.id}>
                      <div className="flex items-center gap-2">
                        <span>{wf.name}</span>
                        <span className="text-xs text-gray-400">({wf.steps.length}步)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 font-medium mb-1">流程说明</p>
              <p className="text-xs text-slate-400">配置后，新提交审批的场景将自动使用该流程进行审批。</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalWorkflowDialogOpen(false)}>取消</Button>
            <Button onClick={() => setIsApprovalWorkflowDialogOpen(false)}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
