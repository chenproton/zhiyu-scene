"use client"

import {
  ArrowLeft,
  ArrowRight,
  Book,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  GripVertical,
  Lightbulb,
  Link2,
  Plus,
  Save,
  Scale,
  Search,
  Star,
  Target,
  Trash2,
  Eye,
  X,
  Play,
  Upload,
  Image,
  Video,
  Globe,
  MapPin,
  Package,
  Award,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Table,
  Strikethrough,
  Palette,
  Type,
  Rows3,
  Gavel,
  ClipboardList,
  Database,
  MessageSquare,
  PenTool,
  Presentation,
  FileQuestion,
  MonitorPlay,
  Users,
  Bot,
  FolderCheck,
  Wrench,
  UserCheck,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  Sparkles,
  ChevronRight,
  File,
  PieChart as PieChartIcon,
} from "lucide-react"
import NextLink from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useMemo, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import {
  scenarios,
  knowledgePoints,
  abilityPoints,
  learningResources,
  positionAbilities,
  questionBank,
  type Task,
  type PositionAbility,
  type GradeMapping,
} from "@/lib/mock-data"

// ============ Types & Configs ============

type CardType = "info" | "description" | "knowledge" | "ability" | "resources" | "evaluation" | "assessment" | "scoring" | "weight"

const cardConfigs: { type: CardType; title: string; icon: React.ReactNode }[] = [
  { type: "info", title: "配置任务\n基础信息", icon: <FileText className="h-4 w-4" /> },
  { type: "description", title: "配置任务\n说明", icon: <Book className="h-4 w-4" /> },
  { type: "knowledge", title: "考查\n知识点", icon: <Lightbulb className="h-4 w-4" /> },
  { type: "ability", title: "考查\n能力点", icon: <Award className="h-4 w-4" /> },
  { type: "resources", title: "配置任务\n资源", icon: <Link2 className="h-4 w-4" /> },
  { type: "evaluation", title: "配置任务\n测评形式", icon: <CheckCircle2 className="h-4 w-4" /> },
  { type: "assessment", title: "配置任务\n测评资源", icon: <Target className="h-4 w-4" /> },
  { type: "scoring", title: "配置任务\n评分规则", icon: <Award className="h-4 w-4" /> },
  { type: "weight", title: "配置任务\n权重", icon: <Scale className="h-4 w-4" /> },
]

const resourceTypeIcons: Record<string, React.ReactNode> = {
  document: <FileText className="h-4 w-4 text-blue-500" />,
  software: <Globe className="h-4 w-4 text-purple-500" />,
  image: <Image className="h-4 w-4 text-green-500" />,
  video: <Video className="h-4 w-4 text-red-500" />,
  link: <Link2 className="h-4 w-4 text-cyan-500" />,
  venue: <MapPin className="h-4 w-4 text-orange-500" />,
  other: <Package className="h-4 w-4 text-gray-500" />,
}

const evaluationMethodOptions = [
  { key: "random_draw", label: "现场抽题", icon: <FileQuestion className="h-5 w-5" />, color: "bg-blue-50 text-blue-600 border-blue-200", available: true, desc: "从题库抽取题目，教师现场提问", category: "基础考核" },
  { key: "review", label: "评审", icon: <Gavel className="h-5 w-5" />, color: "bg-purple-50 text-purple-600 border-purple-200", available: true, desc: "教师根据表现/材料给评价点打分", category: "综合评估" },
  { key: "paper", label: "试卷", icon: <ClipboardList className="h-5 w-5" />, color: "bg-green-50 text-green-600 border-green-200", available: true, desc: "使用固定试卷进行考核", category: "基础考核" },
  { key: "question_bank", label: "题库", icon: <Database className="h-5 w-5" />, color: "bg-orange-50 text-orange-600 border-orange-200", available: true, desc: "从题库选题组成测评资源", category: "基础考核" },
  { key: "defense", label: "答辩", icon: <MessageSquare className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生进行现场答辩", category: "互动评价" },
  { key: "debate", label: "辩论", icon: <PenTool className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生分组进行辩论", category: "互动评价" },
  { key: "presentation", label: "汇报", icon: <Presentation className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生进行成果汇报", category: "互动评价" },
  { key: "quiz", label: "随堂测", icon: <FileQuestion className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "课堂即时测验", category: "基础考核" },
  { key: "ai_qa", label: "Ai 问答", icon: <Bot className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "AI 自动问答评测", category: "智能评测" },
  { key: "outcome", label: "成果评价", icon: <FolderCheck className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "对学生成果进行评价", category: "综合评估" },
  { key: "practical", label: "现场实操", icon: <Wrench className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "现场操作技能考核", category: "互动评价" },
  { key: "roleplay", label: "角色扮演", icon: <Users className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "模拟场景角色扮演", category: "互动评价" },
  { key: "peer", label: "学生互评", icon: <UserCheck className="h-5 w-5" />, color: "bg-gray-50 text-gray-400 border-gray-200", available: false, desc: "学生之间互相评价", category: "综合评估" },
]

const abilityLevels = ["了解", "理解", "掌握", "熟练", "精通"]

const defaultDescriptionTemplate = `<h2>任务描述</h2>
<p>本任务要求学员完成一个完整的企业级前端项目搭建，从项目初始化到用户认证模块开发，涵盖现代前端工程化的核心实践。</p>

<h2>任务目标</h2>
<ul>
<li>掌握 Vite + React + TypeScript 项目搭建流程</li>
<li>理解 ESLint、Prettier 配置规范</li>
<li>实现 JWT 用户认证全流程</li>
</ul>

<h2>任务结果</h2>
<p>提交一个可运行的项目代码仓库，包含完整的登录注册功能、路由配置和状态管理。</p>

<h2>测评要求</h2>
<p>代码需通过自动化测试，评审将从代码规范、功能完整性、安全性三个维度进行打分。</p>`

const defaultGradeMapping: GradeMapping[] = [
  { id: "grade-1", grade: "A", minScore: 90, maxScore: 100, color: "bg-green-500" },
  { id: "grade-2", grade: "B", minScore: 75, maxScore: 89, color: "bg-blue-500" },
  { id: "grade-3", grade: "C", minScore: 60, maxScore: 74, color: "bg-yellow-500" },
  { id: "grade-4", grade: "D", minScore: 0, maxScore: 59, color: "bg-red-500" },
]

const allQuestions = Object.values(questionBank).flat()

const paperMocks = [
  { id: "paper-1", name: "前端基础综合试卷", questionCount: 20, totalScore: 100 },
  { id: "paper-2", name: "React 进阶测试", questionCount: 15, totalScore: 100 },
  { id: "paper-3", name: "API 设计规范测验", questionCount: 10, totalScore: 100 },
]

interface EvalPoint {
  id: string
  name: string
  desc: string
}

interface ScoringConfig {
  teacherBackground: string
  scorerCount: number
  requiresEnterpriseMentor: boolean
}

interface TaskState {
  description: string
  descriptionPdf: string | null
  knowledgePoints: string[]
  knowledgeAutoResources: string[]
  abilityPoints: string[]
  abilityLevelMappings: { abilityId: string; level: number }[]
  resources: string[]
  evaluationMethods: string[]
  randomDrawQuestions: string[]
  randomDrawEvalPoints: EvalPoint[]
  randomDrawScoreType: "eval_points" | "ability_levels"
  reviewEvalPoints: EvalPoint[]
  reviewScoreType: "eval_points" | "ability_levels"
  paperId: string | null
  questionBankQuestions: string[]
  weight: number
  locked: boolean
  gradeMapping: GradeMapping[]
  scoringConfig: ScoringConfig
}

function makeDefaultTaskState(count: number, index: number): TaskState {
  return {
    description: "",
    descriptionPdf: null,
    knowledgePoints: [],
    knowledgeAutoResources: [],
    abilityPoints: [],
    abilityLevelMappings: [],
    resources: [],
    evaluationMethods: [],
    randomDrawQuestions: [],
    randomDrawEvalPoints: [],
    randomDrawScoreType: "eval_points",
    reviewEvalPoints: [],
    reviewScoreType: "eval_points",
    paperId: null,
    questionBankQuestions: [],
    weight: count > 0 ? Math.floor(100 / count) + (index < 100 % count ? 1 : 0) : 0,
    locked: false,
    gradeMapping: JSON.parse(JSON.stringify(defaultGradeMapping)),
    scoringConfig: { teacherBackground: "", scorerCount: 1, requiresEnterpriseMentor: false },
  }
}


// ============ Main Page ============

export default function TasksEditPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params.id as string

  const existingScenario = scenarios.find(s => s.id === scenarioId)

  const [tasks, setTasks] = useState<Task[]>(existingScenario?.tasks || [])

  const [taskStates, setTaskStates] = useState<Record<string, TaskState>>(() => {
    const states: Record<string, TaskState> = {}
    const count = existingScenario?.tasks.length || 0
    existingScenario?.tasks.forEach((t, i) => {
      states[t.id] = {
        description: t.detailedDescription || defaultDescriptionTemplate,
        descriptionPdf: null,
        knowledgePoints: t.knowledgePoints || [],
        knowledgeAutoResources: [],
        abilityPoints: (t as any).abilityPoints || [],
        abilityLevelMappings: [],
        resources: t.resources || [],
        evaluationMethods: [],
        randomDrawQuestions: [],
        randomDrawEvalPoints: [],
        randomDrawScoreType: "eval_points",
        reviewEvalPoints: [],
        reviewScoreType: "eval_points",
        paperId: null,
        questionBankQuestions: [],
        weight: count > 0 ? Math.floor(100 / count) + (i < 100 % count ? 1 : 0) : 0,
        locked: false,
        gradeMapping: JSON.parse(JSON.stringify(defaultGradeMapping)),
        scoringConfig: { teacherBackground: "", scorerCount: 1, requiresEnterpriseMentor: false },
      }
    })
    return states
  })

  const [editingCard, setEditingCard] = useState<{ taskId: string; type: CardType } | null>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isCloneOpen, setIsCloneOpen] = useState(false)

  const [newTask, setNewTask] = useState({
    name: "",
    hours: 4,
    type: "training" as "assessment" | "training",
    difficulty: 3,
    background: "",
  })

  const [cloneSearch, setCloneSearch] = useState("")
  const [cloneMode, setCloneMode] = useState<"clone" | "reference">("clone")
  const [cloneTab, setCloneTab] = useState<"my" | "collab" | "public">("my")
  const [selectedClone, setSelectedClone] = useState<string[]>([])
  const [isWeightConfigOpen, setIsWeightConfigOpen] = useState(false)

  const posAbilities = useMemo(() =>
    positionAbilities.filter(a => a.positionId === existingScenario?.positionId),
    [existingScenario?.positionId]
  )

  const allTasks = useMemo(() =>
    scenarios.flatMap(s => s.tasks.map(t => ({ ...t, scenarioName: s.name }))),
    []
  )

  const totalWeight = Object.values(taskStates).reduce((sum, s) => sum + s.weight, 0)

  const getState = (id: string): TaskState => taskStates[id] || makeDefaultTaskState(0, 0)

  const updateState = (id: string, updates: Partial<TaskState>) => {
    setTaskStates(prev => ({ ...prev, [id]: { ...getState(id), ...updates } }))
  }

  const getSummary = (taskId: string, type: CardType): string => {
    const task = tasks.find(t => t.id === taskId)
    const state = getState(taskId)
    if (!task) return ""

    switch (type) {
      case "info":
        return `${task.name}\n${task.taskType === "assessment" ? "考核" : "训练"} · ${task.difficulty}星 · ${task.estimatedHours}h`
      case "description":
        return state.description ? `${state.description.replace(/<[^>]*>/g, "").slice(0, 50)}...` : "未填写"
      case "knowledge":
        if (state.knowledgePoints.length === 0) return "未配置"
        const kpNames = state.knowledgePoints.map(id => knowledgePoints.find(k => k.id === id)?.name).filter(Boolean)
        return kpNames.slice(0, 3).join("、") + (kpNames.length > 3 ? ` 等${state.knowledgePoints.length}个` : "")
      case "ability":
        if (state.abilityPoints.length === 0) return "未配置"
        const abNames = state.abilityPoints.map(id => abilityPoints.find(a => a.id === id)?.name).filter(Boolean)
        return abNames.slice(0, 3).join("、") + (abNames.length > 3 ? ` 等${state.abilityPoints.length}个` : "")
      case "resources":
        if (state.resources.length === 0) return "未配置"
        const resNames = state.resources.map(id => learningResources.find(r => r.id === id)?.name).filter(Boolean)
        return resNames.slice(0, 3).join("、") + (resNames.length > 3 ? ` 等${state.resources.length}个` : "")
      case "evaluation":
        if (state.evaluationMethods.length === 0) return "未配置"
        return state.evaluationMethods.map(m => evaluationMethodOptions.find(o => o.key === m)?.label).filter(Boolean).join("、")
      case "assessment":
        if (state.evaluationMethods.length === 0) return "未配置评价方式"
        const configuredMethods = state.evaluationMethods.filter(m => {
          if (m === "random_draw") return state.randomDrawQuestions.length > 0 || state.randomDrawEvalPoints.length > 0
          if (m === "review") return state.reviewEvalPoints.length > 0
          if (m === "paper") return !!state.paperId
          if (m === "question_bank") return state.questionBankQuestions.length > 0
          return false
        })
        return configuredMethods.length > 0 ? `已配置 ${configuredMethods.length} 种` : "待配置"
      case "scoring":
        const sc = state.scoringConfig
        const parts = []
        if (sc.teacherBackground) parts.push(sc.teacherBackground)
        if (sc.scorerCount > 0) parts.push(`${sc.scorerCount}人评分`)
        if (sc.requiresEnterpriseMentor) parts.push("需企业导师")
        return parts.length > 0 ? parts.join("、") : "未配置"
      case "weight":
        return `${state.weight}%`
    }
  }

  const isConfigured = (taskId: string, type: CardType): boolean => {
    const state = getState(taskId)
    switch (type) {
      case "info": return true
      case "description": return !!state.description
      case "knowledge": return state.knowledgePoints.length > 0
      case "ability": return state.abilityPoints.length > 0
      case "resources": return state.resources.length > 0
      case "evaluation": return state.evaluationMethods.length > 0
      case "assessment": return state.evaluationMethods.length > 0
      case "scoring": return !!state.scoringConfig.teacherBackground || state.scoringConfig.scorerCount > 0
      case "weight": return state.weight > 0
    }
  }

  const handleAddTask = () => {
    const task: Task = {
      id: `task-${Date.now()}`,
      name: newTask.name,
      code: `T-${Date.now().toString().slice(-6)}`,
      order: tasks.length + 1,
      description: newTask.background,
      estimatedHours: newTask.hours,
      taskType: newTask.type,
      difficulty: newTask.difficulty as 1|2|3|4|5,
      background: newTask.background,
      dependencies: [],
      resources: [],
      deliverables: [],
      knowledgePoints: [],
      abilityPoints: [],
      assessment: null,
    }
    const newTasks = [...tasks, task]
    setTasks(newTasks)
    const count = newTasks.length
    const weight = Math.floor(100 / count)
    const newStates = { ...taskStates }
    Object.keys(newStates).forEach(id => {
      newStates[id] = { ...newStates[id], weight }
    })
    newStates[task.id] = makeDefaultTaskState(count, count - 1)
    newStates[task.id].weight = 100 - weight * (count - 1)
    setTaskStates(newStates)
    setIsAddTaskOpen(false)
    setNewTask({ name: "", hours: 4, type: "training", difficulty: 3, background: "" })
  }

  const handleClone = () => {
    const selected = allTasks.filter(t => selectedClone.includes(t.id))
    const newTasks = selected.map((t, i) => ({
      ...t,
      id: `task-${cloneMode}-${Date.now()}-${i}`,
      order: tasks.length + i + 1,
      isReferenced: cloneMode === "reference",
      sourceScenarioName: cloneMode === "reference" ? t.scenarioName : undefined,
    }))
    setTasks([...tasks, ...newTasks])
    newTasks.forEach((t, i) => {
      setTaskStates(prev => ({
        ...prev,
        [t.id]: makeDefaultTaskState(tasks.length + newTasks.length, tasks.length + i),
      }))
    })
    setIsCloneOpen(false)
    setSelectedClone([])
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
    const newStates = { ...taskStates }
    delete newStates[id]
    setTaskStates(newStates)
  }

  const distributeWeights = () => {
    const unlocked = tasks.filter(t => !getState(t.id).locked)
    const lockedWeight = tasks.filter(t => getState(t.id).locked).reduce((s, t) => s + getState(t.id).weight, 0)
    const remaining = 100 - lockedWeight
    const each = Math.floor(remaining / unlocked.length)
    const newStates = { ...taskStates }
    unlocked.forEach((t, i) => {
      newStates[t.id] = { ...newStates[t.id], weight: each + (i < remaining % unlocked.length ? 1 : 0) }
    })
    setTaskStates(newStates)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <NextLink href={`/scenarios/${scenarioId}/edit`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回
              </NextLink>
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">步骤 2</Badge>
              <span className="text-sm font-medium text-gray-800">任务链配置</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              保存草稿
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              预览
            </Button>
            <Button onClick={() => router.push("/")}>
              完成配置
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        {/* Scenario Info */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{existingScenario?.name || "新建场景"}</CardTitle>
                <CardDescription>
                  {existingScenario?.positionName} | {existingScenario?.industryName} | {existingScenario?.professionName}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < (existingScenario?.difficulty || 3) ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                  ))}
                </div>
                <Badge variant="outline">{existingScenario?.version}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 border-t">
            <p className="text-sm text-gray-600 pt-3">{existingScenario?.background || "暂无介绍"}</p>
          </CardContent>
        </Card>

        {/* Tasks Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg">任务列表</h2>
            <Badge variant="secondary">{tasks.length} 个任务</Badge>
            <div className={cn(
              "flex items-center gap-1 text-sm px-2 py-1 rounded",
              totalWeight === 100 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
            )}>
              <Scale className="h-3.5 w-3.5" />
              权重: {totalWeight}%
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsWeightConfigOpen(true)}>
              <PieChartIcon className="mr-2 h-4 w-4" />
              配置任务权重
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsCloneOpen(true)}>
              <Copy className="mr-2 h-4 w-4" />
              克隆/引用
            </Button>
            <Button size="sm" onClick={() => setIsAddTaskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              添加任务
            </Button>
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-start gap-3 pl-10">
          {cardConfigs.map(c => (
            <div key={c.type} className="w-44 shrink-0 text-xs text-gray-500 text-center whitespace-pre-line leading-tight py-1">
              {c.title}
            </div>
          ))}
        </div>

        {/* Task Rows */}
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border hover:border-primary/30 transition-colors group">
              {/* Order */}
              <div className="flex items-center gap-1 shrink-0 w-8">
                <GripVertical className="h-4 w-4 text-gray-300 cursor-grab" />
                <span className="text-xs text-gray-400 font-medium">{idx + 1}</span>
              </div>

              {/* Cards */}
              <div className="flex items-center gap-3 flex-1 overflow-x-auto pb-1">
                {cardConfigs.map(config => {
                  const configured = isConfigured(task.id, config.type)
                  const summary = getSummary(task.id, config.type)
                  const isRef = task.isReferenced && config.type !== "weight"
                  const isWeightReadonly = config.type === "weight"

                  return (
                    <button
                      key={config.type}
                      onClick={() => !isRef && !isWeightReadonly && setEditingCard({ taskId: task.id, type: config.type })}
                      disabled={isRef || isWeightReadonly}
                      className={cn(
                        "w-44 h-28 shrink-0 rounded-lg border p-3 text-left transition-all flex flex-col",
                        isRef || isWeightReadonly
                          ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
                          : configured
                            ? "bg-white border-gray-200 hover:border-primary hover:shadow-sm"
                            : "bg-gray-50 border-dashed border-gray-300 hover:border-primary"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className={cn(
                          "p-1 rounded",
                          configured ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
                        )}>
                          {config.icon}
                        </div>
                        <span className="text-xs font-medium truncate flex-1">{config.title}</span>
                        {isRef && <Badge variant="outline" className="text-[10px] px-1 py-0">引用</Badge>}
                      </div>
                      <p className={cn(
                        "text-xs line-clamp-3 flex-1 leading-relaxed",
                        configured ? "text-gray-600" : "text-gray-400"
                      )}>
                        {summary}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="py-16 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">暂无任务，点击添加第一个任务</p>
              <Button onClick={() => setIsAddTaskOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                添加任务
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>任务名称</Label>
              <Input value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} placeholder="输入任务名称" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>任务类型</Label>
                <Select value={newTask.type} onValueChange={v => setNewTask({ ...newTask, type: v as "assessment" | "training" })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">训练任务</SelectItem>
                    <SelectItem value="assessment">考核任务</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>预估课时</Label>
                <Input type="number" value={newTask.hours} onChange={e => setNewTask({ ...newTask, hours: +e.target.value })} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>难度</Label>
              <div className="flex gap-1 mt-1.5">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setNewTask({ ...newTask, difficulty: n })}>
                    <Star className={cn("h-6 w-6", n <= newTask.difficulty ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>背景介绍</Label>
              <Textarea value={newTask.background} onChange={e => setNewTask({ ...newTask, background: e.target.value })} placeholder="简述任务背景" className="mt-1.5" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>取消</Button>
            <Button onClick={handleAddTask} disabled={!newTask.name}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clone Dialog */}
      <Dialog open={isCloneOpen} onOpenChange={setIsCloneOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>克隆/引用任务</DialogTitle>
            <DialogDescription>从其他场景选择任务进行克隆或引用</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant={cloneMode === "clone" ? "default" : "outline"} size="sm" onClick={() => setCloneMode("clone")}>克隆（可编辑）</Button>
                <Button variant={cloneMode === "reference" ? "default" : "outline"} size="sm" onClick={() => setCloneMode("reference")}>引用（只读）</Button>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input value={cloneSearch} onChange={e => setCloneSearch(e.target.value)} placeholder="搜索任务名称、编码..." className="pl-9" />
              </div>
            </div>
            <Tabs value={cloneTab} onValueChange={v => setCloneTab(v as "my" | "collab" | "public")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="my">我的</TabsTrigger>
                <TabsTrigger value="collab">共建</TabsTrigger>
                <TabsTrigger value="public">公共库</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1 overflow-y-auto border rounded-lg">
              {/* Table Header */}
              <div className="grid grid-cols-[48px_1fr_120px_140px_120px] gap-3 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 border-b sticky top-0">
                <div></div>
                <div>任务名称</div>
                <div>任务编码</div>
                <div>关联场景</div>
                <div>关联岗位</div>
              </div>
              {allTasks
                .filter(t => {
                  if (cloneTab === "my") return t.scenarioName?.includes("场景") || true
                  if (cloneTab === "collab") return t.scenarioName?.includes("协作") || false
                  if (cloneTab === "public") return t.scenarioName?.includes("公共") || false
                  return true
                })
                .filter(t => !cloneSearch || t.name.includes(cloneSearch) || t.code?.includes(cloneSearch) || t.scenarioName?.includes(cloneSearch))
                .map(t => {
                  const selected = selectedClone.includes(t.id)
                  return (
                    <div key={t.id} onClick={() => setSelectedClone(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])} className={cn("grid grid-cols-[48px_1fr_120px_140px_120px] gap-3 px-4 py-3 border-b cursor-pointer items-center text-sm hover:bg-gray-50", selected ? "bg-primary/5" : "")}>
                      <div className="flex justify-center">
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selected ? "bg-primary border-primary" : "border-gray-300")}>
                          {selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-gray-500 text-xs">{t.code}</div>
                      <div className="text-gray-500 text-xs truncate">{t.scenarioName}</div>
                      <div className="text-gray-500 text-xs">{existingScenario?.positionName || "-"}</div>
                    </div>
                  )
                })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloneOpen(false)}>取消</Button>
            <Button onClick={handleClone} disabled={selectedClone.length === 0}>确定 ({selectedClone.length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      {editingCard && (
        <EditCardDialog
          allTasks={tasks}
          taskId={editingCard.taskId}
          cardType={editingCard.type}
          task={tasks.find(t => t.id === editingCard.taskId)!}
          state={getState(editingCard.taskId)}
          updateState={(updates) => updateState(editingCard.taskId, updates)}
          updateTask={(updates) => setTasks(tasks.map(t => t.id === editingCard.taskId ? { ...t, ...updates } : t))}
          allTaskStates={taskStates}
          updateAnyState={(id, updates) => updateState(id, updates)}
          onClose={() => setEditingCard(null)}
        />
      )}

      {/* Weight Config Dialog */}
      <WeightConfigDialog
        open={isWeightConfigOpen}
        onOpenChange={setIsWeightConfigOpen}
        tasks={tasks}
        taskStates={taskStates}
        updateAnyState={(id, updates) => updateState(id, updates)}
      />
    </div>
  )
}


// ============ Edit Card Dialog ============

function EditCardDialog({
  allTasks,
  taskId,
  cardType,
  task,
  state,
  updateState,
  updateTask,
  allTaskStates,
  updateAnyState,
  onClose,
}: {
  allTasks: Task[]
  taskId: string
  cardType: CardType
  task: Task
  state: TaskState
  updateState: (u: Partial<TaskState>) => void
  updateTask: (u: Partial<Task>) => void
  allTaskStates: Record<string, TaskState>
  updateAnyState: (id: string, u: Partial<TaskState>) => void
  onClose: () => void
}) {
  const config = cardConfigs.find(c => c.type === cardType)!
  const [search, setSearch] = useState("")
  const [localTask, setLocalTask] = useState({ name: task.name, type: task.taskType, difficulty: task.difficulty, hours: task.estimatedHours, background: task.background })

  // For knowledge / ability "create new"
  const [showAddKnowledge, setShowAddKnowledge] = useState(false)
  const [newKnowledgeName, setNewKnowledgeName] = useState("")
  const [newKnowledgeDesc, setNewKnowledgeDesc] = useState("")
  const [newKnowledgeCategory, setNewKnowledgeCategory] = useState("通用")

  const [showAddAbility, setShowAddAbility] = useState(false)
  const [newAbilityName, setNewAbilityName] = useState("")
  const [newAbilityDesc, setNewAbilityDesc] = useState("")
  const [newAbilityCategory, setNewAbilityCategory] = useState("通用")

  // For evaluation full-screen dialog
  const [evalDialogOpen, setEvalDialogOpen] = useState(false)

  // For scoring config
  const [selectedGradeTaskId, setSelectedGradeTaskId] = useState(taskId)

  // For resources filter
  const [resType, setResType] = useState("all")

  // For assessment config
  const [assessActiveTab, setAssessActiveTab] = useState<string | null>(state.evaluationMethods[0] || null)
  const [newPointName, setNewPointName] = useState("")

  const handleSave = () => {
    if (cardType === "info") {
      updateTask({ name: localTask.name, taskType: localTask.type as "assessment"|"training", difficulty: localTask.difficulty as 1|2|3|4|5, estimatedHours: localTask.hours, background: localTask.background })
    }
    onClose()
  }

  const handleAddKnowledge = () => {
    if (!newKnowledgeName.trim()) return
    const newId = `kp-new-${Date.now()}`
    knowledgePoints.push({ id: newId, name: newKnowledgeName.trim(), description: newKnowledgeDesc.trim(), category: newKnowledgeCategory })
    updateState({ knowledgePoints: [...state.knowledgePoints, newId] })
    setNewKnowledgeName("")
    setNewKnowledgeDesc("")
    setShowAddKnowledge(false)
  }

  const handleAddAbility = () => {
    if (!newAbilityName.trim()) return
    const newId = `ab-new-${Date.now()}`
    abilityPoints.push({ id: newId, name: newAbilityName.trim(), description: newAbilityDesc.trim(), category: newAbilityCategory })
    updateState({ abilityPoints: [...state.abilityPoints, newId] })
    setNewAbilityName("")
    setNewAbilityDesc("")
    setShowAddAbility(false)
  }

  // Rich text editor mock toolbar items
  const toolbarItems = [
    [{ icon: <Heading1 className="h-4 w-4" />, label: "H1" }, { icon: <Heading2 className="h-4 w-4" />, label: "H2" }],
    [{ icon: <Type className="h-4 w-4" />, label: "正文" }],
    [{ icon: <b className="text-xs">B</b>, label: "加粗" }, { icon: <i className="text-xs">I</i>, label: "斜体" }, { icon: <u className="text-xs">U</u>, label: "下划线" }, { icon: <Strikethrough className="h-4 w-4" />, label: "删除线" }],
    [{ icon: <AlignLeft className="h-4 w-4" />, label: "左对齐" }, { icon: <AlignCenter className="h-4 w-4" />, label: "居中" }, { icon: <AlignRight className="h-4 w-4" />, label: "右对齐" }],
    [{ icon: <List className="h-4 w-4" />, label: "无序列表" }, { icon: <ListOrdered className="h-4 w-4" />, label: "有序列表" }],
    [{ icon: <Quote className="h-4 w-4" />, label: "引用" }, { icon: <Code className="h-4 w-4" />, label: "代码" }],
    [{ icon: <LinkIcon className="h-4 w-4" />, label: "链接" }, { icon: <Image className="h-4 w-4" />, label: "图片" }, { icon: <Video className="h-4 w-4" />, label: "视频" }],
    [{ icon: <Table className="h-4 w-4" />, label: "表格" }, { icon: <Minus className="h-4 w-4" />, label: "分割线" }],
    [{ icon: <Palette className="h-4 w-4" />, label: "字体颜色" }, { icon: <Sparkles className="h-4 w-4" />, label: "背景色" }],
  ]

  const renderContent = () => {
    switch (cardType) {
      case "info":
        return (
          <div className="space-y-4">
            <div><Label>任务名称</Label><Input value={localTask.name} onChange={e => setLocalTask({ ...localTask, name: e.target.value })} className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>类型</Label><Select value={localTask.type} onValueChange={v => setLocalTask({ ...localTask, type: v as "assessment"|"training" })}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="training">训练</SelectItem><SelectItem value="assessment">考核</SelectItem></SelectContent></Select></div>
              <div><Label>课时</Label><Input type="number" value={localTask.hours} onChange={e => setLocalTask({ ...localTask, hours: +e.target.value })} className="mt-1.5" /></div>
            </div>
            <div><Label>难度</Label><div className="flex gap-1 mt-1.5">{([1,2,3,4,5] as const).map(n => <button key={n} onClick={() => setLocalTask({ ...localTask, difficulty: n })}><Star className={cn("h-6 w-6", n <= localTask.difficulty ? "fill-amber-400 text-amber-400" : "text-gray-200")} /></button>)}</div></div>
            <div><Label>背景</Label><Textarea value={localTask.background} onChange={e => setLocalTask({ ...localTask, background: e.target.value })} className="mt-1.5" rows={3} /></div>
          </div>
        )

      case "description": {
        const [descMode, setDescMode] = useState<"rich_text" | "pdf">("rich_text")
        return (
          <div className="space-y-3 h-full flex flex-col">
            <Tabs value={descMode} onValueChange={v => setDescMode(v as "rich_text" | "pdf")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rich_text">富文本编辑</TabsTrigger>
                <TabsTrigger value="pdf">PDF 上传</TabsTrigger>
              </TabsList>
            </Tabs>
            {descMode === "rich_text" ? (
              <div className="flex-1 flex flex-col min-h-0">
                <p className="text-xs text-gray-500 mb-2">可编写详细的操作手册，支持图文混排</p>
                <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
                  {/* Mock Toolbar */}
                  <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-1">
                    {toolbarItems.map((group, gi) => (
                      <div key={gi} className="flex items-center gap-0.5 mr-2">
                        {group.map((item, ii) => (
                          <Button key={ii} variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-primary hover:bg-primary/5" title={item.label}>
                            {item.icon}
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* Mock Editor Area */}
                  <div className="p-4 flex-1 bg-white">
                    <Textarea
                      value={state.description}
                      onChange={e => updateState({ description: e.target.value })}
                      placeholder="在此输入详细的任务说明..."
                      className="border-0 min-h-full focus-visible:ring-0 resize-none text-sm leading-relaxed"
                    />
                  </div>
                  {/* Mock Status Bar */}
                  <div className="bg-gray-50 border-t px-3 py-1.5 flex items-center justify-between text-xs text-gray-400">
                    <span>纯文本模式</span>
                    <span>{state.description.length} 字符</span>
                  </div>
                </div>
                {state.description.includes("<img") || state.description.includes("<video") ? (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700 flex items-center gap-2 mt-2">
                    <Image className="h-4 w-4" />
                    检测到已插入多媒体内容
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 space-y-4">
                {state.descriptionPdf ? (
                  <div className="text-center space-y-3">
                    <div className="w-24 h-32 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center mx-auto">
                      <File className="h-10 w-10 text-red-500 mb-2" />
                      <span className="text-[10px] text-red-600 font-medium">PDF</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{state.descriptionPdf}</p>
                    <Button variant="outline" size="sm" onClick={() => updateState({ descriptionPdf: null })}>
                      <Trash2 className="h-4 w-4 mr-1" />移除文件
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">点击或拖拽上传 PDF 文件</p>
                      <p className="text-xs text-gray-500 mt-1">支持 PDF 格式，最大 20MB</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => updateState({ descriptionPdf: "任务说明书示例.pdf" })}>
                      <Upload className="h-4 w-4 mr-1" />模拟上传
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        )
      }

      case "knowledge": {
        const [kpDetailOpen, setKpDetailOpen] = useState(false)
        const [selectedKpForDetail, setSelectedKpForDetail] = useState<string | null>(null)
        const filteredKp = knowledgePoints.filter(k => !search || k.name.includes(search) || k.description.includes(search))
        const hasExactMatch = search && knowledgePoints.some(k => k.name === search)

        const toggleKp = (kpId: string) => {
          const selected = state.knowledgePoints.includes(kpId)
          const newKps = selected ? state.knowledgePoints.filter(x => x !== kpId) : [...state.knowledgePoints, kpId]
          updateState({ knowledgePoints: newKps })
        }

        const toggleKpResource = (resId: string) => {
          const selected = state.knowledgeAutoResources.includes(resId)
          updateState({ knowledgeAutoResources: selected ? state.knowledgeAutoResources.filter(x => x !== resId) : [...state.knowledgeAutoResources, resId] })
        }

        const detailKp = selectedKpForDetail ? knowledgePoints.find(k => k.id === selectedKpForDetail) : null
        const detailResources = detailKp?.relatedResources?.map(rid => learningResources.find(r => r.id === rid)).filter(Boolean) || []

        return (
          <div className="h-full flex flex-col">
            <div className="flex gap-4 flex-1 min-h-0">
              {/* Left: Knowledge Points */}
              <div className="w-3/5 flex flex-col min-h-0">
                <div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索知识点" className="pl-9" /></div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {filteredKp.map(kp => {
                    const selected = state.knowledgePoints.includes(kp.id)
                    const kpRes = kp.relatedResources?.map(rid => learningResources.find(r => r.id === rid)).filter(Boolean) || []
                    return (
                      <div key={kp.id} className={cn("p-3 rounded-lg border", selected ? "border-primary bg-primary/5" : "border-gray-200")}>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleKp(kp.id)}>
                          <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selected ? "bg-primary border-primary" : "border-gray-300")}>{selected && <CheckCircle2 className="h-3 w-3 text-white" />}</div>
                          <span className="text-sm font-medium flex-1">{kp.name}</span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={e => { e.stopPropagation(); setSelectedKpForDetail(kp.id); setKpDetailOpen(true) }}>
                            详情
                          </Button>
                          {kp.category && <Badge variant="secondary" className="text-xs">{kp.category}</Badge>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">{kp.description}</p>
                        {kpRes.length > 0 && (
                          <div className="mt-2 ml-6 space-y-1.5">
                            <p className="text-[11px] text-gray-400">关联资源：</p>
                            <div className="flex flex-wrap gap-1.5">
                              {kpRes.map(res => {
                                if (!res) return null
                                const resSelected = state.knowledgeAutoResources.includes(res.id)
                                return (
                                  <button key={res.id} onClick={() => toggleKpResource(res.id)} className={cn("inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-all", resSelected ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                                    {resourceTypeIcons[res.type]}
                                    <span className="truncate max-w-[100px]">{res.name}</span>
                                    {resSelected && <CheckCircle2 className="h-3 w-3" />}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {search && !hasExactMatch && filteredKp.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm border border-dashed rounded-lg">
                      <p>未找到 "{search}" 相关的知识点</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => { setNewKnowledgeName(search); setShowAddKnowledge(true) }}>
                        <Plus className="h-3 w-3 mr-1" />新增此知识点
                      </Button>
                    </div>
                  )}
                </div>
                {/* Bottom: Selected Summary */}
                {state.knowledgePoints.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">已选知识点 ({state.knowledgePoints.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {state.knowledgePoints.map(kpId => {
                        const kp = knowledgePoints.find(k => k.id === kpId)
                        return kp ? (
                          <Badge key={kpId} variant="secondary" className="text-xs cursor-pointer" onClick={() => toggleKp(kpId)}>
                            {kp.name} <X className="h-3 w-3 ml-1 inline" />
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Selected Resources */}
              <div className="w-2/5 border-l pl-4 flex flex-col min-h-0">
                <p className="text-sm font-medium mb-3">关联资源（自动加入任务资源）</p>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {state.knowledgeAutoResources.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Link2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">在左侧勾选知识点关联资源<br />资源将自动加入任务资源</p>
                    </div>
                  ) : (
                    state.knowledgeAutoResources.map(resId => {
                      const res = learningResources.find(r => r.id === resId)
                      if (!res) return null
                      return (
                        <div key={resId} className="p-2.5 rounded-lg border border-primary/20 bg-primary/5 flex items-center gap-2">
                          {resourceTypeIcons[res.type]}
                          <span className="text-sm flex-1 truncate">{res.name}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={() => toggleKpResource(resId)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    })
                  )}
                </div>
                {state.knowledgeAutoResources.length > 0 && (
                  <p className="text-xs text-primary mt-2">已选 {state.knowledgeAutoResources.length} 个关联资源</p>
                )}
              </div>
            </div>

            {showAddKnowledge && (
              <div className="p-4 border rounded-lg bg-gray-50 space-y-3 mt-3">
                <p className="text-sm font-medium">新增知识点</p>
                <Input value={newKnowledgeName} onChange={e => setNewKnowledgeName(e.target.value)} placeholder="知识点名称" />
                <Input value={newKnowledgeCategory} onChange={e => setNewKnowledgeCategory(e.target.value)} placeholder="分类" />
                <Textarea value={newKnowledgeDesc} onChange={e => setNewKnowledgeDesc(e.target.value)} placeholder="描述" rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowAddKnowledge(false)}>取消</Button>
                  <Button size="sm" onClick={handleAddKnowledge} disabled={!newKnowledgeName.trim()}>添加并选中</Button>
                </div>
              </div>
            )}

            {/* Knowledge Point Detail Dialog */}
            <Dialog open={kpDetailOpen} onOpenChange={setKpDetailOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>知识点详情</DialogTitle>
                </DialogHeader>
                {detailKp && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs text-gray-500">知识点名称</Label>
                      <p className="text-sm font-medium mt-1">{detailKp.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">知识点描述</Label>
                      <p className="text-sm text-gray-700 mt-1">{detailKp.description}</p>
                    </div>
                    {detailKp.category && (
                      <div>
                        <Label className="text-xs text-gray-500">分类</Label>
                        <Badge variant="secondary" className="mt-1">{detailKp.category}</Badge>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-gray-500">关联资源</Label>
                      <div className="space-y-2 mt-2">
                        {detailResources.length > 0 ? detailResources.map(res => (
                          <div key={res!.id} className="flex items-center gap-2 p-2 rounded border text-sm">
                            {resourceTypeIcons[res!.type]}
                            <span className="flex-1">{res!.name}</span>
                          </div>
                        )) : <p className="text-sm text-gray-400">暂无关联资源</p>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => setKpDetailOpen(false)}>
                      <Plus className="h-4 w-4 mr-1" />添加资源（模拟）
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )
      }

      case "ability": {
        const [abilityDetailOpen, setAbilityDetailOpen] = useState(false)
        const [selectedAbilityForDetail, setSelectedAbilityForDetail] = useState<string | null>(null)
        const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({})

        const toggleAbility = (abId: string) => {
          const selected = state.abilityPoints.includes(abId)
          updateState({ abilityPoints: selected ? state.abilityPoints.filter(x => x !== abId) : [...state.abilityPoints, abId] })
        }

        // Group by domain
        const domainGroups = abilityPoints.reduce((acc, ab) => {
          const domain = ab.domain || "其他"
          if (!acc[domain]) acc[domain] = []
          acc[domain].push(ab)
          return acc
        }, {} as Record<string, typeof abilityPoints>)

        const detailAb = selectedAbilityForDetail ? abilityPoints.find(a => a.id === selectedAbilityForDetail) : null

        return (
          <div className="h-full flex flex-col">
            <div className="flex gap-4 flex-1 min-h-0">
              {/* Left: Domain -> Ability tree */}
              <div className="w-1/2 flex flex-col min-h-0 border rounded-xl p-3">
                <div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索能力点" className="pl-9" /></div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {Object.entries(domainGroups).map(([domain, abilities]) => {
                    const filtered = abilities.filter(a => !search || a.name.includes(search) || a.description.includes(search))
                    if (filtered.length === 0) return null
                    const expanded = expandedDomains[domain] !== false
                    return (
                      <div key={domain} className="border rounded-lg overflow-hidden">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          onClick={() => setExpandedDomains(prev => ({ ...prev, [domain]: !expanded }))}
                        >
                          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          {domain}
                          <Badge variant="secondary" className="text-[10px] ml-auto">{filtered.length}</Badge>
                        </button>
                        {expanded && (
                          <div className="p-2 space-y-1">
                            {filtered.map(ab => {
                              const selected = state.abilityPoints.includes(ab.id)
                              return (
                                <div key={ab.id} className={cn("flex items-center gap-2 p-2 rounded cursor-pointer text-sm", selected ? "bg-primary/5" : "hover:bg-gray-50")}>
                                  <div onClick={() => toggleAbility(ab.id)} className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selected ? "bg-primary border-primary" : "border-gray-300")}>
                                    {selected && <CheckCircle2 className="h-3 w-3 text-white" />}
                                  </div>
                                  <span className="flex-1 truncate cursor-pointer" onClick={() => toggleAbility(ab.id)}>{ab.name}</span>
                                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5" onClick={() => { setSelectedAbilityForDetail(ab.id); setAbilityDetailOpen(true) }}>
                                    详情
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Selected abilities */}
              <div className="w-1/2 flex flex-col min-h-0 border rounded-xl p-3">
                <p className="text-sm font-medium mb-3">已选能力点 ({state.abilityPoints.length})</p>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {state.abilityPoints.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">从左侧选择能力点</p>
                    </div>
                  ) : (
                    state.abilityPoints.map(abId => {
                      const ab = abilityPoints.find(a => a.id === abId)
                      if (!ab) return null
                      return (
                        <div key={abId} className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium flex-1">{ab.name}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={() => toggleAbility(abId)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{ab.description}</p>
                          {ab.domain && <Badge variant="secondary" className="text-[10px] mt-2">{ab.domain}</Badge>}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {showAddAbility && (
              <div className="p-4 border rounded-lg bg-gray-50 space-y-3 mt-3">
                <p className="text-sm font-medium">新增能力点</p>
                <Input value={newAbilityName} onChange={e => setNewAbilityName(e.target.value)} placeholder="能力点名称" />
                <Input value={newAbilityCategory} onChange={e => setNewAbilityCategory(e.target.value)} placeholder="分类" />
                <Textarea value={newAbilityDesc} onChange={e => setNewAbilityDesc(e.target.value)} placeholder="描述" rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowAddAbility(false)}>取消</Button>
                  <Button size="sm" onClick={handleAddAbility} disabled={!newAbilityName.trim()}>添加并选中</Button>
                </div>
              </div>
            )}

            {/* Ability Detail Dialog */}
            <Dialog open={abilityDetailOpen} onOpenChange={setAbilityDetailOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>能力点详情</DialogTitle>
                </DialogHeader>
                {detailAb && (
                  <div className="space-y-4 py-2">
                    <div>
                      <Label className="text-xs text-gray-500">能力点名称</Label>
                      <p className="text-sm font-medium mt-1">{detailAb.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">能力点描述</Label>
                      <p className="text-sm text-gray-700 mt-1">{detailAb.description}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">所属能力领域</Label>
                      <p className="text-sm text-gray-700 mt-1">{detailAb.domain || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">熟练程度描述</Label>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{detailAb.proficiencyDesc || "-"}</p>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )
      }

      case "resources": {
        const types = ["all", "document", "video", "software", "link", "image", "venue", "other"]
        const filteredRes = learningResources.filter(r => (resType === "all" || r.type === resType) && (!search || r.name.includes(search)))
        return (
          <div className="space-y-4">
            <div className="flex gap-1 flex-wrap">{types.map(t => <Button key={t} variant={resType === t ? "default" : "outline"} size="sm" onClick={() => setResType(t)}>{t === "all" ? "全部" : t}</Button>)}</div>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索资源" className="pl-9" /></div>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {filteredRes.map(r => {
                const selected = state.resources.includes(r.id)
                return (
                  <div key={r.id} onClick={() => updateState({ resources: selected ? state.resources.filter(x => x !== r.id) : [...state.resources, r.id] })} className={cn("p-2.5 rounded-lg border cursor-pointer", selected ? "border-primary bg-primary/5" : "hover:border-gray-300")}>
                    <div className="flex items-center gap-2 mb-1">{resourceTypeIcons[r.type]}{selected && <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />}</div>
                    <p className="text-sm font-medium truncate">{r.name}</p>
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-gray-500 border-t pt-2">已选 {state.resources.length} 个</p>
          </div>
        )
      }


      case "evaluation": {
        const toggleMethod = (key: string) => {
          const opts = evaluationMethodOptions.find(o => o.key === key)
          if (!opts || !opts.available) return
          const enabled = state.evaluationMethods.includes(key)
          const newMethods = enabled ? state.evaluationMethods.filter(m => m !== key) : [...state.evaluationMethods, key]
          updateState({ evaluationMethods: newMethods })
        }

        const categories = Array.from(new Set(evaluationMethodOptions.map(m => m.category)))
        const categoryBgColors: Record<string, string> = {
          "基础考核": "bg-blue-50/50",
          "综合评估": "bg-purple-50/50",
          "互动评价": "bg-amber-50/50",
          "智能评测": "bg-cyan-50/50",
        }

        return (
          <div className="h-full overflow-y-auto pr-2 space-y-5">
            {categories.map(cat => {
              const catMethods = evaluationMethodOptions.filter(m => m.category === cat)
              const bgClass = categoryBgColors[cat] || "bg-gray-50/50"
              return (
                <div key={cat} className={cn("rounded-2xl p-5 border", bgClass, "border-gray-100")}>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-sm font-bold text-gray-800">{cat}</h3>
                    <div className="h-px flex-1 bg-gray-200/60" />
                    <span className="text-xs text-gray-400">{catMethods.length} 种</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {catMethods.map(method => {
                      const enabled = state.evaluationMethods.includes(method.key)
                      return (
                        <button
                          key={method.key}
                          disabled={!method.available}
                          onClick={() => toggleMethod(method.key)}
                          className={cn(
                            "p-4 rounded-xl border text-left transition-all flex flex-col gap-2.5 relative overflow-hidden",
                            !method.available
                              ? "opacity-50 cursor-not-allowed bg-white border-gray-200"
                              : enabled
                                ? "border-primary bg-white ring-1 ring-primary/20 shadow-sm"
                                : "border-gray-200 hover:border-primary/40 bg-white hover:shadow-sm"
                          )}
                        >
                          {!method.available && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                              <span className="text-xl font-bold text-gray-300/60 rotate-[-12deg] select-none border-2 border-gray-300/40 px-3 py-1 rounded">未购买</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2.5">
                              <div className={cn("p-2 rounded-lg", method.available ? method.color : "bg-gray-100 text-gray-400")}>{method.icon}</div>
                              <div>
                                <p className={cn("text-sm font-semibold", !method.available && "text-gray-400")}>{method.label}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{method.desc}</p>
                              </div>
                            </div>
                            {enabled && (
                              <div className="flex items-center gap-1.5 text-primary text-xs font-medium bg-primary/5 px-2 py-1 rounded-full">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                已开通
                              </div>
                            )}
                            {!method.available && (
                              <Badge variant="outline" className="text-[10px] text-gray-400 border-gray-300 bg-white">未购买</Badge>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {state.evaluationMethods.length === 0 && (
              <div className="p-12 text-center text-gray-400 border border-dashed rounded-xl">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">请选择至少一种评价方式</p>
              </div>
            )}
          </div>
        )
      }

      case "assessment": {
        const [assessEditOpen, setAssessEditOpen] = useState(false)
        const [assessEditMethod, setAssessEditMethod] = useState<string | null>(null)
        const [qSearch, setQSearch] = useState("")
        const [pSearch, setPSearch] = useState("")

        const activeMethod = state.evaluationMethods[0] || null

        const addEvalPoint = (field: "randomDrawEvalPoints" | "reviewEvalPoints") => {
          if (!newPointName.trim()) return
          const newPoint = { id: `ep-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, name: newPointName.trim(), desc: "" }
          if (field === "randomDrawEvalPoints") {
            updateState({ randomDrawEvalPoints: [...state.randomDrawEvalPoints, newPoint] })
          } else {
            updateState({ reviewEvalPoints: [...state.reviewEvalPoints, newPoint] })
          }
          setNewPointName("")
        }

        const removeEvalPoint = (field: "randomDrawEvalPoints" | "reviewEvalPoints", id: string) => {
          if (field === "randomDrawEvalPoints") {
            updateState({ randomDrawEvalPoints: state.randomDrawEvalPoints.filter(p => p.id !== id) })
          } else {
            updateState({ reviewEvalPoints: state.reviewEvalPoints.filter(p => p.id !== id) })
          }
        }

        const toggleQuestion = (qid: string, field: "randomDrawQuestions" | "questionBankQuestions") => {
          const arr = field === "randomDrawQuestions" ? state.randomDrawQuestions : state.questionBankQuestions
          const exists = arr.includes(qid)
          const newArr = exists ? arr.filter(x => x !== qid) : [...arr, qid]
          if (field === "randomDrawQuestions") updateState({ randomDrawQuestions: newArr })
          else updateState({ questionBankQuestions: newArr })
        }

        const ScoreTypeToggle = ({ scoreType, onChange }: { scoreType: "eval_points" | "ability_levels"; onChange: (v: "eval_points" | "ability_levels") => void }) => (
          <div className="flex gap-2 mb-4">
            <button onClick={() => onChange("eval_points")} className={cn("flex-1 py-2 rounded-lg text-sm border transition-all", scoreType === "eval_points" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300")}>评价点评分</button>
            <button onClick={() => onChange("ability_levels")} className={cn("flex-1 py-2 rounded-lg text-sm border transition-all", scoreType === "ability_levels" ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300")}>能力点档次</button>
          </div>
        )

        const EvalPointPanel = ({ points, field }: { points: EvalPoint[]; field: "randomDrawEvalPoints" | "reviewEvalPoints" }) => (
          <div className="space-y-2">
            {points.map(ep => (
              <div key={ep.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                <Input value={ep.name} onChange={e => {
                  const newPoints = field === "randomDrawEvalPoints"
                    ? state.randomDrawEvalPoints.map(p => p.id === ep.id ? { ...p, name: e.target.value } : p)
                    : state.reviewEvalPoints.map(p => p.id === ep.id ? { ...p, name: e.target.value } : p)
                  updateState({ [field]: newPoints } as Partial<TaskState>)
                }} className="flex-1 h-8 text-sm" />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeEvalPoint(field, ep.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input value={newPointName} onChange={e => setNewPointName(e.target.value)} placeholder="输入评价点名称" className="flex-1 h-9" />
              <Button size="sm" onClick={() => addEvalPoint(field)}>添加</Button>
            </div>
          </div>
        )

        const AbilityLevelPanel = () => (
          <div className="space-y-3">
            {state.abilityPoints.length === 0 ? (
              <div className="p-6 text-center text-gray-400 border border-dashed rounded-lg">
                <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">未配置考察能力点</p>
                <p className="text-xs mt-1">请先配置「考察能力点」</p>
              </div>
            ) : (
              state.abilityPoints.map(aid => {
                const ab = abilityPoints.find(a => a.id === aid)
                if (!ab) return null
                const mapping = state.abilityLevelMappings.find(m => m.abilityId === aid)
                const currentLevel = mapping?.level || 1
                return (
                  <div key={aid} className="p-3 bg-white border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{ab.name}</span>
                      <span className="text-sm font-semibold text-primary">{abilityLevels[currentLevel - 1]}</span>
                    </div>
                    <Slider value={[currentLevel]} onValueChange={v => {
                      const newMappings = [...state.abilityLevelMappings.filter(m => m.abilityId !== aid), { abilityId: aid, level: v[0] }]
                      updateState({ abilityLevelMappings: newMappings })
                    }} min={1} max={5} step={1} />
                    <div className="flex justify-between mt-1">
                      {abilityLevels.map((level, idx) => (
                        <span key={level} className={cn("text-[11px]", idx + 1 === currentLevel ? "text-primary font-medium" : "text-gray-400")}>{level}</span>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )

        const AutoScoreTip = ({ text }: { text: string }) => (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
            <ClipboardList className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">{text}</p>
            <p className="text-xs mt-1 text-gray-400">无需配置评价点或能力点档次</p>
          </div>
        )

        const getMethodSummary = (methodKey: string) => {
          switch (methodKey) {
            case "random_draw":
              return {
                title: "现场抽题",
                summary: `${state.randomDrawQuestions.length} 题 / ${state.randomDrawEvalPoints.length} 个评价点`,
                configured: state.randomDrawQuestions.length > 0,
              }
            case "review":
              return {
                title: "评审",
                summary: `${state.reviewEvalPoints.length} 个评价点`,
                configured: state.reviewEvalPoints.length > 0,
              }
            case "paper":
              return {
                title: "试卷",
                summary: state.paperId ? paperMocks.find(p => p.id === state.paperId)?.name || "已选择" : "未选择",
                configured: !!state.paperId,
              }
            case "question_bank":
              return {
                title: "题库",
                summary: `${state.questionBankQuestions.length} 题`,
                configured: state.questionBankQuestions.length > 0,
              }
            default: return { title: "", summary: "", configured: false }
          }
        }

        const getMethodScoreRule = (methodKey: string) => {
          switch (methodKey) {
            case "random_draw": return state.randomDrawScoreType === "eval_points" ? "评价点评分" : "能力点档次"
            case "review": return state.reviewScoreType === "eval_points" ? "评价点评分" : "能力点档次"
            case "paper": return "试卷得分自动换算"
            case "question_bank": return "题目得分自动换算"
            default: return "-"
          }
        }

        return (
          <div className="h-full flex flex-col">
            {state.evaluationMethods.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Target className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">尚未配置评价方式</p>
                <p className="text-xs mt-1">请先在「配置任务测评形式」中选择评价类型</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                <p className="text-sm font-medium mb-2">测评资源配置（每行对应一种评价方式的完整业务流程）</p>
                {state.evaluationMethods.map(methodKey => {
                  const method = evaluationMethodOptions.find(o => o.key === methodKey)
                  const summary = getMethodSummary(methodKey)
                  if (!method) return null
                  return (
                    <div
                      key={methodKey}
                      onClick={() => { setAssessEditMethod(methodKey); setAssessEditOpen(true) }}
                      className={cn(
                        "grid grid-cols-[200px_1fr_200px] gap-4 p-4 rounded-xl border cursor-pointer transition-all items-center",
                        summary.configured
                          ? "border-primary bg-primary/[0.03] hover:bg-primary/[0.05]"
                          : "border-gray-200 bg-gray-50/50 hover:border-primary/40 hover:bg-white"
                      )}
                    >
                      {/* Col 1: Evaluation Method */}
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg shrink-0", method.color)}>{method.icon}</div>
                        <div>
                          <p className="text-sm font-semibold">{method.label}</p>
                          <p className="text-[11px] text-gray-400">{method.desc}</p>
                        </div>
                      </div>

                      {/* Col 2: Resource Config */}
                      <div className="flex items-center gap-3 px-4 border-x border-gray-100">
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-1">测评资源</p>
                          <p className={cn("text-sm", summary.configured ? "text-primary font-medium" : "text-gray-400")}>{summary.summary}</p>
                        </div>
                        {summary.configured && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                        {!summary.configured && (
                          <Badge variant="outline" className="text-[10px] text-gray-400 shrink-0">待配置</Badge>
                        )}
                      </div>

                      {/* Col 3: Score Rule */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1">评价规则</p>
                        <p className="text-sm text-gray-700">{getMethodScoreRule(methodKey)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Sub-dialog for editing assessment details */}
            <Dialog open={assessEditOpen} onOpenChange={setAssessEditOpen}>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>
                    配置 {evaluationMethodOptions.find(o => o.key === assessEditMethod)?.label} 测评资源
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-4">
                  {assessEditMethod === "random_draw" && (
                    <div className="flex gap-4">
                      <div className="w-1/2 border rounded-xl p-4">
                        <p className="text-sm font-medium mb-2">题目范围（从题库选择）</p>
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input value={qSearch} onChange={e => setQSearch(e.target.value)} placeholder="搜索题目..." className="pl-9" />
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {allQuestions.filter(q => !qSearch || q.content.includes(qSearch)).map(q => {
                            const selected = state.randomDrawQuestions.includes(q.id)
                            return (
                              <div key={q.id} onClick={() => toggleQuestion(q.id, "randomDrawQuestions")} className={cn("p-2.5 rounded-lg border cursor-pointer text-sm", selected ? "border-primary bg-primary/5" : "hover:border-gray-300")}>
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selected ? "bg-primary border-primary" : "border-gray-300")}>{selected && <CheckCircle2 className="h-3 w-3 text-white" />}</div>
                                  <span className="flex-1 line-clamp-1">{q.content}</span>
                                  <Badge variant="secondary" className="text-xs">{q.type === "single" ? "单选" : q.type === "multiple" ? "多选" : "判断"}</Badge>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">已选 {state.randomDrawQuestions.length} 题</p>
                      </div>
                      <div className="w-1/2 border rounded-xl p-4">
                        <ScoreTypeToggle scoreType={state.randomDrawScoreType} onChange={v => updateState({ randomDrawScoreType: v })} />
                        {state.randomDrawScoreType === "eval_points" ? (
                          <EvalPointPanel points={state.randomDrawEvalPoints} field="randomDrawEvalPoints" />
                        ) : (
                          <AbilityLevelPanel />
                        )}
                      </div>
                    </div>
                  )}

                  {assessEditMethod === "review" && (
                    <div className="flex gap-4">
                      <div className="w-1/2 border rounded-xl p-4">
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4" />
                            <span className="font-medium">评审说明</span>
                          </div>
                          <p>评审时教师根据学生现场表现或提交的材料进行打分。</p>
                          <p className="mt-2">请在右侧选择评分方式：评价点 或 能力点档次。</p>
                        </div>
                      </div>
                      <div className="w-1/2 border rounded-xl p-4">
                        <ScoreTypeToggle scoreType={state.reviewScoreType} onChange={v => updateState({ reviewScoreType: v })} />
                        {state.reviewScoreType === "eval_points" ? (
                          <EvalPointPanel points={state.reviewEvalPoints} field="reviewEvalPoints" />
                        ) : (
                          <AbilityLevelPanel />
                        )}
                      </div>
                    </div>
                  )}

                  {assessEditMethod === "paper" && (
                    <div className="flex gap-4">
                      <div className="w-1/2 border rounded-xl p-4">
                        <p className="text-sm font-medium mb-2">选择已有试卷</p>
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input value={pSearch} onChange={e => setPSearch(e.target.value)} placeholder="搜索试卷..." className="pl-9" />
                        </div>
                        <div className="space-y-2">
                          {paperMocks.filter(p => !pSearch || p.name.includes(pSearch)).map(paper => {
                            const selected = state.paperId === paper.id
                            return (
                              <div key={paper.id} onClick={() => updateState({ paperId: selected ? null : paper.id })} className={cn("p-4 rounded-lg border cursor-pointer flex items-center justify-between", selected ? "border-primary bg-primary/5" : "hover:border-gray-300")}>
                                <div className="flex items-center gap-3">
                                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selected ? "bg-primary border-primary" : "border-gray-300")}>{selected && <CheckCircle2 className="h-3 w-3 text-white" />}</div>
                                  <div>
                                    <p className="text-sm font-medium">{paper.name}</p>
                                    <p className="text-xs text-gray-500">{paper.questionCount} 题 / 总分 {paper.totalScore}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">固定试卷</Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="w-1/2 border rounded-xl p-4">
                        <AutoScoreTip text="根据试卷得分直接输出成绩" />
                      </div>
                    </div>
                  )}

                  {assessEditMethod === "question_bank" && (
                    <div className="flex gap-4">
                      <div className="w-1/2 border rounded-xl p-4">
                        <p className="text-sm font-medium mb-2">从题库选题组成测评资源</p>
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input value={qSearch} onChange={e => setQSearch(e.target.value)} placeholder="搜索题目..." className="pl-9" />
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {allQuestions.filter(q => !qSearch || q.content.includes(qSearch)).map(q => {
                            const selected = state.questionBankQuestions.includes(q.id)
                            return (
                              <div key={q.id} onClick={() => toggleQuestion(q.id, "questionBankQuestions")} className={cn("p-2.5 rounded-lg border cursor-pointer text-sm", selected ? "border-primary bg-primary/5" : "hover:border-gray-300")}>
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center", selected ? "bg-primary border-primary" : "border-gray-300")}>{selected && <CheckCircle2 className="h-3 w-3 text-white" />}</div>
                                  <span className="flex-1 line-clamp-1">{q.content}</span>
                                  <Badge variant="secondary" className="text-xs">{q.type === "single" ? "单选" : q.type === "multiple" ? "多选" : "判断"}</Badge>
                                  <span className="text-xs text-gray-400">{q.score}分</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">已选 {state.questionBankQuestions.length} 题 / 总分 {allQuestions.filter(q => state.questionBankQuestions.includes(q.id)).reduce((s, q) => s + q.score, 0)} 分</p>
                      </div>
                      <div className="w-1/2 border rounded-xl p-4">
                        <AutoScoreTip text="根据题目总得分直接输出成绩" />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAssessEditOpen(false)}>关闭</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )
      }


      case "weight": {
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Scale className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">任务权重已在全局配置</p>
            <p className="text-xs mt-1">请点击顶部「配置任务权重」按钮进行设置</p>
          </div>
        )
      }

      case "scoring": {
        const [scoringEditOpen, setScoringEditOpen] = useState(false)
        const [scoringEditMethod, setScoringEditMethod] = useState<string | null>(null)

        const gradeState = allTaskStates[selectedGradeTaskId]?.gradeMapping || defaultGradeMapping
        const gradeColors = [
          { value: "bg-green-500", light: "bg-green-50 border-green-200 text-green-700" },
          { value: "bg-blue-500", light: "bg-blue-50 border-blue-200 text-blue-700" },
          { value: "bg-yellow-500", light: "bg-yellow-50 border-yellow-200 text-yellow-700" },
          { value: "bg-red-500", light: "bg-red-50 border-red-200 text-red-700" },
          { value: "bg-purple-500", light: "bg-purple-50 border-purple-200 text-purple-700" },
        ]

        const updateGrade = (gradeId: string, field: keyof GradeMapping, value: string | number) => {
          const current = allTaskStates[selectedGradeTaskId]?.gradeMapping || defaultGradeMapping
          updateAnyState(selectedGradeTaskId, {
            gradeMapping: current.map(g => g.id === gradeId ? { ...g, [field]: value } : g)
          })
        }

        const getScoringSummary = (methodKey: string) => {
          switch (methodKey) {
            case "random_draw": return state.randomDrawScoreType === "eval_points" ? `${state.randomDrawEvalPoints.length} 个评价点` : `能力点档次评分`
            case "review": return state.reviewScoreType === "eval_points" ? `${state.reviewEvalPoints.length} 个评价点` : `能力点档次评分`
            case "paper": return `试卷得分自动换算`
            case "question_bank": return `题目得分自动换算`
            default: return "-"
          }
        }

        const getGradeSummary = () => {
          const gm = state.gradeMapping
          return gm.map(g => `${g.grade}(${g.minScore}-${g.maxScore})`).join(" / ")
        }

        return (
          <div className="h-full flex flex-col">
            <p className="text-sm font-medium mb-3">评分规则概览（按评价方式）</p>
            {state.evaluationMethods.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Award className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">尚未配置评价方式</p>
                <p className="text-xs mt-1">请先在「配置任务测评形式」中选择评价类型</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3">
                {state.evaluationMethods.map(methodKey => {
                  const method = evaluationMethodOptions.find(o => o.key === methodKey)
                  if (!method) return null
                  return (
                    <div key={methodKey} onClick={() => { setScoringEditMethod(methodKey); setScoringEditOpen(true) }} className="p-4 rounded-xl border border-gray-200 hover:border-primary/40 cursor-pointer transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("p-2 rounded-lg", method.color)}>{method.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{method.label}</p>
                          <p className="text-xs text-gray-500">{getScoringSummary(methodKey)}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5">
                        <span>师资背景: {state.scoringConfig.teacherBackground || "未配置"}</span>
                        <span>评分人数: {state.scoringConfig.scorerCount}人</span>
                        <span>等级: {getGradeSummary()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Sub-dialog for scoring details */}
            <Dialog open={scoringEditOpen} onOpenChange={setScoringEditOpen}>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>
                    配置 {evaluationMethodOptions.find(o => o.key === scoringEditMethod)?.label} 评分规则
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-4">
                  <Tabs defaultValue="teacher">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="teacher">师资要求</TabsTrigger>
                      <TabsTrigger value="grade">成绩等级规则</TabsTrigger>
                    </TabsList>

                    <TabsContent value="teacher" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label>教师专业背景要求</Label>
                          <Input value={state.scoringConfig.teacherBackground} onChange={e => updateState({ scoringConfig: { ...state.scoringConfig, teacherBackground: e.target.value } })} placeholder="例如：计算机相关专业、具有3年以上项目经验" className="mt-1.5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>评分人数</Label>
                            <Input type="number" value={state.scoringConfig.scorerCount} onChange={e => updateState({ scoringConfig: { ...state.scoringConfig, scorerCount: Math.max(1, parseInt(e.target.value) || 1) } })} className="mt-1.5" min={1} />
                          </div>
                          <div>
                            <Label>企业导师要求</Label>
                            <div className="flex items-center gap-3 mt-3">
                              <Switch checked={state.scoringConfig.requiresEnterpriseMentor} onCheckedChange={v => updateState({ scoringConfig: { ...state.scoringConfig, requiresEnterpriseMentor: v } })} />
                              <span className="text-sm text-gray-600">{state.scoringConfig.requiresEnterpriseMentor ? "需要企业导师参与评分" : "无需企业导师"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="grade" className="space-y-4 mt-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {allTasks.map(t => (
                          <Button key={t.id} variant={selectedGradeTaskId === t.id ? "default" : "outline"} size="sm" onClick={() => setSelectedGradeTaskId(t.id)}>
                            {t.name}
                          </Button>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">配置「{allTasks.find(t => t.id === selectedGradeTaskId)?.name}」的成绩等级映射</p>
                        <div className="h-10 bg-gray-100 rounded-lg overflow-hidden flex">
                          {[...gradeState].sort((a, b) => a.minScore - b.minScore).map(grade => {
                            const width = grade.maxScore - grade.minScore + 1
                            return (
                              <div key={grade.id} className={cn("flex items-center justify-center text-white font-medium text-sm transition-all", grade.color)} style={{ width: `${width}%` }}>
                                {grade.grade}
                              </div>
                            )
                          })}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[...gradeState].sort((a, b) => b.maxScore - a.maxScore).map((grade, index) => {
                            const colorConfig = gradeColors[index % gradeColors.length]
                            return (
                              <div key={grade.id} className={cn("rounded-lg border p-4 transition-all", colorConfig.light)}>
                                <div className="flex items-center justify-between mb-3">
                                  <Input value={grade.grade} onChange={e => updateGrade(grade.id, "grade", e.target.value)} className="w-20 h-8 text-center font-semibold" />
                                  <div className={cn("w-4 h-4 rounded-full", grade.color)} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input type="number" value={grade.minScore} onChange={e => updateGrade(grade.id, "minScore", parseInt(e.target.value) || 0)} className="w-16 h-7 text-center text-sm" min={0} max={100} />
                                  <span className="text-gray-500">-</span>
                                  <Input type="number" value={grade.maxScore} onChange={e => updateGrade(grade.id, "maxScore", parseInt(e.target.value) || 0)} className="w-16 h-7 text-center text-sm" min={0} max={100} />
                                  <span className="text-sm text-gray-500">分</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setScoringEditOpen(false)}>关闭</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )
      }
    }
  }

  const isFullScreen = cardType === "assessment" || cardType === "weight" || cardType === "evaluation"

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(
        "flex flex-col overflow-hidden",
        isFullScreen ? "sm:max-w-[95vw] max-h-[95vh] h-[95vh]" : "sm:max-w-[550px] max-h-[85vh]"
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded">{config.icon}</div>
            {config.title}
          </DialogTitle>
          <DialogDescription>任务：{task.name}</DialogDescription>
        </DialogHeader>
        <div className={cn("flex-1 py-4", isFullScreen ? "overflow-hidden" : "overflow-y-auto")}>{renderContent()}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


// ============ Weight Config Dialog ============

function WeightConfigDialog({
  open,
  onOpenChange,
  tasks,
  taskStates,
  updateAnyState,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  tasks: Task[]
  taskStates: Record<string, TaskState>
  updateAnyState: (id: string, u: Partial<TaskState>) => void
}) {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-cyan-500", "bg-pink-500"]
  const pieColors = ["#3b82f6", "#22c55e", "#a855f7", "#f97316", "#06b6d4", "#ec4899"]

  const handleGlobalWeightChange = (tid: string, val: number) => {
    updateAnyState(tid, { weight: Math.max(0, Math.min(100, val)) })
  }

  const toggleGlobalLock = (tid: string) => {
    const s = taskStates[tid]
    updateAnyState(tid, { locked: !s?.locked })
  }

  const distributeGlobal = () => {
    const unlocked = tasks.filter(t => !taskStates[t.id]?.locked)
    const lockedWeight = tasks.filter(t => taskStates[t.id]?.locked).reduce((s, t) => s + (taskStates[t.id]?.weight || 0), 0)
    const remaining = 100 - lockedWeight
    const each = Math.floor(remaining / unlocked.length)
    unlocked.forEach((t, i) => {
      updateAnyState(t.id, { weight: each + (i < remaining % unlocked.length ? 1 : 0) })
    })
  }

  const totalW = tasks.reduce((sum, t) => sum + (taskStates[t.id]?.weight || 0), 0)

  const pieData = tasks.map((t, i) => ({
    name: t.name,
    value: taskStates[t.id]?.weight || 0,
    color: pieColors[i % pieColors.length],
  })).filter(d => d.value > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            配置任务权重
          </DialogTitle>
          <DialogDescription>调整所有任务的权重分配，总权重应为 100%</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={cn("text-lg font-semibold", totalW === 100 ? "text-green-600" : "text-amber-600")}>总权重: {totalW}%</span>
              {totalW !== 100 && <span className="text-sm text-amber-600">{totalW > 100 ? `超出 ${totalW - 100}%` : `还需分配 ${100 - totalW}%`}</span>}
            </div>
            <Button variant="outline" size="sm" onClick={distributeGlobal}>
              <Scale className="mr-2 h-4 w-4" />
              一键平均分配
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="h-64 overflow-y-auto space-y-2">
              {tasks.map((t, i) => (
                <div key={t.id} className="flex items-center gap-2 text-sm">
                  <div className={cn("w-3 h-3 rounded-full shrink-0", colors[i % colors.length])} />
                  <span className="truncate flex-1">{t.name}</span>
                  <span className="text-gray-500 font-medium">{taskStates[t.id]?.weight || 0}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
            {tasks.map((t, i) => (
              <div key={t.id} className={cn("transition-all duration-300", colors[i % colors.length])} style={{ width: `${taskStates[t.id]?.weight || 0}%` }} />
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks.map((t, i) => {
              const s = taskStates[t.id]
              return (
                <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <div className={cn("w-3 h-8 rounded-full shrink-0", colors[i % colors.length])} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">{i + 1}</span>
                      <span className="font-medium text-gray-700 truncate text-sm">{t.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Input type="number" value={s?.weight || 0} onChange={e => handleGlobalWeightChange(t.id, parseInt(e.target.value) || 0)} disabled={s?.locked} className={cn("w-20 text-center", s?.locked && "bg-gray-50")} min={0} max={100} />
                    <span className="text-gray-500 w-4">%</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => toggleGlobalLock(t.id)} className={cn("h-8 w-8", s?.locked ? "text-amber-500" : "text-gray-400")}>
                    {s?.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
