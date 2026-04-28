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
  Check,
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
  Headphones,
  Archive,
  Building2,
  RotateCcw,
  Shield,
  Server,
  Layers,
  BookOpen,
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
  DialogTrigger,
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
  granularLessons,
  professions,
  type Task,
  type PositionAbility,
  type GradeMapping,
} from "@/lib/mock-data"

// ============ Types & Configs ============

type CardType = "info" | "description" | "knowledge" | "ability" | "resources" | "evaluation" | "evaluationRules" | "weight"

const cardConfigs: { type: CardType; title: string; icon: React.ReactNode }[] = [
  { type: "info", title: "配置任务\n基础信息", icon: <FileText className="h-4 w-4" /> },
  { type: "description", title: "配置任务\n说明", icon: <Book className="h-4 w-4" /> },
  { type: "knowledge", title: "考查\n知识点", icon: <Lightbulb className="h-4 w-4" /> },
  { type: "ability", title: "考查\n能力点", icon: <Award className="h-4 w-4" /> },
  { type: "resources", title: "配置任务\n资源", icon: <Link2 className="h-4 w-4" /> },
  { type: "evaluation", title: "配置任务\n测评形式", icon: <CheckCircle2 className="h-4 w-4" /> },
  { type: "evaluationRules", title: "配置任务\n评价规则", icon: <Gavel className="h-4 w-4" /> },
  { type: "weight", title: "配置任务\n权重", icon: <Scale className="h-4 w-4" /> },
]

const resourceTypeIcons: Record<string, React.ReactNode> = {
  document: <FileText className="h-4 w-4 text-blue-500" />,
  spreadsheet: <Table className="h-4 w-4 text-teal-500" />,
  image: <Image className="h-4 w-4 text-green-500" />,
  link: <Link2 className="h-4 w-4 text-cyan-500" />,
  audio: <Headphones className="h-4 w-4 text-violet-500" />,
  video: <Video className="h-4 w-4 text-red-500" />,
  archive: <Archive className="h-4 w-4 text-amber-500" />,
  tool: <Wrench className="h-4 w-4 text-indigo-500" />,
  venue: <MapPin className="h-4 w-4 text-orange-500" />,
  facility: <Building2 className="h-4 w-4 text-rose-500" />,
  software: <Globe className="h-4 w-4 text-purple-500" />,
  other: <Package className="h-4 w-4 text-gray-500" />,
}

const resourceTypeLabels: Record<string, string> = {
  all: "全部",
  document: "文档资源",
  spreadsheet: "表格资源",
  image: "图片资源",
  link: "链接资源",
  audio: "音频资源",
  video: "视频资源",
  archive: "压缩包资源",
  tool: "软件工具资源",
  venue: "场地资源",
  facility: "设施设备资源",
  software: "软件资源",
  other: "其他资源",
}

const resourceTypeColors: Record<string, string> = {
  document: "bg-blue-50 text-blue-600 border-blue-200",
  spreadsheet: "bg-teal-50 text-teal-600 border-teal-200",
  image: "bg-green-50 text-green-600 border-green-200",
  link: "bg-cyan-50 text-cyan-600 border-cyan-200",
  audio: "bg-violet-50 text-violet-600 border-violet-200",
  video: "bg-red-50 text-red-600 border-red-200",
  archive: "bg-amber-50 text-amber-600 border-amber-200",
  tool: "bg-indigo-50 text-indigo-600 border-indigo-200",
  venue: "bg-orange-50 text-orange-600 border-orange-200",
  facility: "bg-rose-50 text-rose-600 border-rose-200",
  software: "bg-purple-50 text-purple-600 border-purple-200",
  other: "bg-gray-50 text-gray-600 border-gray-200",
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

const defaultDescriptionTemplate = `任务描述

你需要完成 [具体任务]。该任务基于 [背景/前提]，要求你 [核心动作]。执行时请注意 [关键约束]，确保理解需求后再开始。

任务目标

• 核心目标：[一句话概括最终成果]
• 目标一：[具体子目标]
• 目标二：[具体子目标]
• 目标三：[具体子目标]
• 成功标准：[任务完成的具体标志]

任务结果

请提交以下内容：

• 主交付物：[如报告/代码/方案]
• 格式要求：[如 Markdown/JSON/纯文本]
• 附属说明：[假设、来源、取舍等]
• 篇幅要求：[如不少于 500 字/代码 100 行内]

测评要求

• 准确性（30%）：内容正确，逻辑清晰，来源可靠
• 完整性（25%）：覆盖所有子目标，无遗漏
• 清晰度（20%）：结构分明，表达简洁
• 实用性（15%）：结论可操作，建议可落地
• 规范性（10%）：符合格式，术语统一，无明显错误

一票否决项：若出现 [如抄袭/泄密/核心事实错误]，视为未通过。`

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

type EvalObjectType = "individual" | "group" | "individual_and_group"

interface EvalSubjectConfig {
  type: "teacher" | "enterprise_mentor" | "peer" | "self" | "ai" | "service_target"
  enabled: boolean
  params?: {
    teacherBackground?: string
    scorerCount?: number
    requiresEnterpriseMentor?: boolean
    peerCount?: number
    aiModel?: string
  }
}

type EvalSubType = "knowledge_mastery" | "operation_standard" | "task_completion" | "result_quality" | "communication" | "collaboration" | "professionalism" | "innovation" | "adaptability"

const evalSubTypeLabels: Record<EvalSubType, string> = {
  knowledge_mastery: "知识掌握",
  operation_standard: "操作规范",
  task_completion: "任务完成度",
  result_quality: "成果质量",
  communication: "沟通表达",
  collaboration: "协作能力",
  professionalism: "职业素养",
  innovation: "创新能力",
  adaptability: "应变能力",
}

const evalSubTypeColors: Record<EvalSubType, string> = {
  knowledge_mastery: "bg-blue-50 text-blue-600 border-blue-200",
  operation_standard: "bg-teal-50 text-teal-600 border-teal-200",
  task_completion: "bg-green-50 text-green-600 border-green-200",
  result_quality: "bg-cyan-50 text-cyan-600 border-cyan-200",
  communication: "bg-violet-50 text-violet-600 border-violet-200",
  collaboration: "bg-orange-50 text-orange-600 border-orange-200",
  professionalism: "bg-amber-50 text-amber-600 border-amber-200",
  innovation: "bg-indigo-50 text-indigo-600 border-indigo-200",
  adaptability: "bg-rose-50 text-rose-600 border-rose-200",
}

interface EvalPoint {
  id: string
  name: string
  desc: string
  subType?: EvalSubType
  knowledgePointIds?: string[]
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
  evalObject: EvalObjectType
  evalSubjects: EvalSubjectConfig[]
}

const defaultEvalSubjects: EvalSubjectConfig[] = [
  { type: "teacher", enabled: true, params: { teacherBackground: "", scorerCount: 1, requiresEnterpriseMentor: false } },
  { type: "enterprise_mentor", enabled: false },
  { type: "peer", enabled: false, params: { peerCount: 3 } },
  { type: "self", enabled: false },
  { type: "ai", enabled: false, params: { aiModel: "默认模型" } },
  { type: "service_target", enabled: false },
]

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
    evalObject: "individual",
    evalSubjects: JSON.parse(JSON.stringify(defaultEvalSubjects)),
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
        evalObject: "individual",
        evalSubjects: JSON.parse(JSON.stringify(defaultEvalSubjects)),
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
        return `任务名称：${task.name}\n编码：${task.code || "-"}\n任务类型：${task.taskType === "assessment" ? "考核" : "训练"}\n难度：${task.difficulty}星\n预估学时：${task.estimatedHours}小时`
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
      case "evaluationRules":
        if (state.evaluationMethods.length === 0) return "未配置评价方式"
        const configuredMethods = state.evaluationMethods.filter(m => {
          if (m === "random_draw") return state.randomDrawQuestions.length > 0 || state.randomDrawEvalPoints.length > 0
          if (m === "review") return state.reviewEvalPoints.length > 0
          if (m === "paper") return !!state.paperId
          if (m === "question_bank") return state.questionBankQuestions.length > 0
          return false
        })
        return configuredMethods.length > 0 ? `已配置 ${configuredMethods.length} 种` : "待配置"
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
      case "evaluationRules": return state.evaluationMethods.length > 0
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
            <Button size="sm" onClick={() => setIsAddTaskOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              添加任务
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsCloneOpen(true)}>
              <Copy className="mr-2 h-4 w-4" />
              克隆/引用
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsWeightConfigOpen(true)}>
              <PieChartIcon className="mr-2 h-4 w-4" />
              配置任务权重
            </Button>
          </div>
        </div>

        {/* Task List with unified horizontal scroll */}
        <div className="overflow-x-auto pb-2">
          {/* Column Headers */}
          <div className="flex items-start gap-3 pl-10 min-w-max">
            {cardConfigs.map(c => (
              <div key={c.type} className="w-52 shrink-0 text-xs text-gray-500 text-center whitespace-pre-line leading-tight py-1">
                {c.title}
              </div>
            ))}
          </div>

          {/* Task Rows */}
          <div className="space-y-3 min-w-max">
            {tasks.map((task, idx) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border hover:border-primary/30 transition-colors group">
                {/* Order */}
                <div className="flex items-center gap-1 shrink-0 w-8">
                  <GripVertical className="h-4 w-4 text-gray-300 cursor-grab" />
                  <span className="text-xs text-gray-400 font-medium">{idx + 1}</span>
                </div>

                {/* Cards */}
                <div className="flex items-center gap-3 flex-1">
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
                          "w-52 h-36 shrink-0 rounded-lg border p-3 text-left transition-all flex flex-col",
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
                          "text-xs line-clamp-5 flex-1 leading-relaxed whitespace-pre-line",
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
                <div className="flex items-center gap-2">
                  <Label>预估学时</Label>
                  <span className="text-xs text-gray-400">学生完成任务的预估时长</span>
                </div>
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
          positionId={existingScenario?.positionId}
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


// Module-level set to track custom (added/cloned) knowledge points across dialog re-opens
const customKnowledgePointIds = new Set<string>()

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
  positionId,
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
  positionId?: string
}) {
  const config = cardConfigs.find(c => c.type === cardType)!
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

  // For ability search
  const [abilitySearch, setAbilitySearch] = useState("")
  const [abilityDetailOpen, setAbilityDetailOpen] = useState(false)
  const [selectedAbilityForDetail, setSelectedAbilityForDetail] = useState<string | null>(null)
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({})

  // For knowledge
  const [kpSearch, setKpSearch] = useState("")
  const [kpDetailOpen, setKpDetailOpen] = useState(false)
  const [selectedKpForDetail, setSelectedKpForDetail] = useState<string | null>(null)
  const [kpActionOpen, setKpActionOpen] = useState(false)
  const [kpActionMode, setKpActionMode] = useState<"add" | "clone" | null>(null)
  const [kpActionTarget, setKpActionTarget] = useState<(typeof knowledgePoints)[0] | null>(null)
  const [newKpForm, setNewKpForm] = useState({ name: "", description: "", code: "", granularLessons: [] as string[] })
  const [glSelectOpen, setGlSelectOpen] = useState(false)
  const [glSelectTargetKp, setGlSelectTargetKp] = useState<string | null>(null)
  const [glSearch, setGlSearch] = useState("")

  // Determine if a knowledge point is reference (original library) or custom (added/cloned)
  const isReferenceKp = (kpId: string) => !customKnowledgePointIds.has(kpId)

  // For resources search & upload
  const [resSearchName, setResSearchName] = useState("")
  const [resSearchProvider, setResSearchProvider] = useState("")
  const [showUploadRes, setShowUploadRes] = useState(false)
  const [newResName, setNewResName] = useState("")
  const [newResType, setNewResType] = useState("document")

  // For assessment config
  const [assessActiveTab, setAssessActiveTab] = useState<string | null>(state.evaluationMethods[0] || null)
  const [newPointName, setNewPointName] = useState("")

  // For evaluation rules
  const [erActiveMethod, setErActiveMethod] = useState<string | null>(state.evaluationMethods[0] || null)
  const [erActiveStep, setErActiveStep] = useState(0)
  const [erQSearch, setErQSearch] = useState("")
  const [erPSearch, setErPSearch] = useState("")
  const [erKpSearch, setErKpSearch] = useState("")

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

  const handleUploadResource = () => {
    if (!newResName.trim()) return
    const newId = `lr-upload-${Date.now()}`
    const newRes = {
      id: newId,
      name: newResName.trim(),
      type: newResType as any,
      url: "",
      description: "",
      knowledgePoints: [],
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: "当前用户",
      thumbnail: "/placeholder.svg",
    }
    learningResources.push(newRes as any)
    updateState({ resources: [...state.resources, newId] })
    setNewResName("")
    setNewResType("document")
    setShowUploadRes(false)
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
              <div><Label>任务类型</Label><Select value={localTask.type} onValueChange={v => setLocalTask({ ...localTask, type: v as "assessment"|"training" })}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="training">训练</SelectItem><SelectItem value="assessment">考核</SelectItem></SelectContent></Select></div>
              <div>
                <div className="flex items-center gap-2">
                  <Label>预估学时</Label>
                  <span className="text-xs text-gray-400">学生完成任务的预估时长</span>
                </div>
                <Input type="number" value={localTask.hours} onChange={e => setLocalTask({ ...localTask, hours: +e.target.value })} className="mt-1.5" />
              </div>
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
                <TabsTrigger value="pdf">上传任务说明书</TabsTrigger>
              </TabsList>
            </Tabs>
            {descMode === "rich_text" ? (
              <div className="flex-1 flex flex-col min-h-0">
                <p className="text-xs text-gray-500 mb-2">可编写详细的操作手册，支持图文混排</p>
                <div className="border rounded-lg overflow-hidden flex-1 flex flex-col min-h-[450px]">
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
                      placeholder={`任务描述

你需要完成 [具体任务]。该任务基于 [背景/前提]，要求你 [核心动作]。执行时请注意 [关键约束]，确保理解需求后再开始。

任务目标

• 核心目标：[一句话概括最终成果]
• 目标一：[具体子目标]
• 目标二：[具体子目标]
• 目标三：[具体子目标]
• 成功标准：[任务完成的具体标志]

任务结果

请提交以下内容：

• 主交付物：[如报告/代码/方案]
• 格式要求：[如 Markdown/JSON/纯文本]
• 附属说明：[假设、来源、取舍等]
• 篇幅要求：[如不少于 500 字/代码 100 行内]

测评要求

• 准确性（30%）：内容正确，逻辑清晰，来源可靠
• 完整性（25%）：覆盖所有子目标，无遗漏
• 清晰度（20%）：结构分明，表达简洁
• 实用性（15%）：结论可操作，建议可落地
• 规范性（10%）：符合格式，术语统一，无明显错误

一票否决项：若出现 [如抄袭/泄密/核心事实错误]，视为未通过。`}
                      className="border-0 min-h-full w-full focus-visible:ring-0 resize-none text-sm leading-relaxed"
                    />
                  </div>
                  {/* Mock Status Bar */}
                  <div className="bg-gray-50 border-t px-3 py-1.5 flex items-center justify-between text-xs text-gray-400">
                    <span>纯文本模式</span>
                    <span>{state.description.length} 字符</span>
                  </div>
                </div>
                {state.description.includes('<img') || state.description.includes('<video') ? (
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
                      <p className="text-sm font-medium text-gray-700">点击或拖拽上传任务说明书</p>
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
        const filteredKp = knowledgePoints.filter(k => !kpSearch || k.name.includes(kpSearch) || k.description.includes(kpSearch) || (k.code && k.code.includes(kpSearch)))
        const hasResults = kpSearch ? filteredKp.length > 0 : false

        const generateKpCode = () => `KP-${Date.now().toString().slice(-6)}`

        const handleReferenceKp = (kpId: string) => {
          if (state.knowledgePoints.includes(kpId)) return
          updateState({ knowledgePoints: [...state.knowledgePoints, kpId] })
        }

        const handleRemoveKp = (kpId: string) => {
          updateState({ knowledgePoints: state.knowledgePoints.filter(x => x !== kpId) })
        }

        const openAddKp = () => {
          setNewKpForm({ name: kpSearch, description: "", code: generateKpCode(), granularLessons: [] })
          setKpActionMode("add")
          setKpActionTarget(null)
          setKpActionOpen(true)
        }

        const openCloneKp = (kp: (typeof knowledgePoints)[0]) => {
          setNewKpForm({ name: `${kp.name}（克隆）`, description: kp.description, code: generateKpCode(), granularLessons: kp.granularLessons || [] })
          setKpActionMode("clone")
          setKpActionTarget(kp)
          setKpActionOpen(true)
        }

        const handleSaveNewKp = () => {
          if (!newKpForm.name.trim()) return
          const newId = `kp-${kpActionMode}-${Date.now()}`
          const newKp = {
            id: newId,
            name: newKpForm.name.trim(),
            description: newKpForm.description.trim(),
            code: newKpForm.code,
            granularLessons: newKpForm.granularLessons,
          }
          knowledgePoints.push(newKp as any)
          customKnowledgePointIds.add(newId)
          updateState({ knowledgePoints: [...state.knowledgePoints, newId] })
          setKpActionOpen(false)
          setKpSearch("")
        }

        const openGlSelect = (kpId: string) => {
          setGlSelectTargetKp(kpId)
          setGlSearch("")
          setGlSelectOpen(true)
        }

        const handleToggleGlForKp = (glId: string) => {
          const kp = knowledgePoints.find(k => k.id === glSelectTargetKp)
          if (!kp) return
          const current = kp.granularLessons || []
          const updated = current.includes(glId) ? current.filter(x => x !== glId) : [...current, glId]
          kp.granularLessons = updated
          updateState({ knowledgePoints: [...state.knowledgePoints] })
        }

        const detailKp = selectedKpForDetail ? knowledgePoints.find(k => k.id === selectedKpForDetail) : null
        const detailGranularLessons = detailKp?.granularLessons?.map(gid => granularLessons.find(g => g.id === gid)).filter(Boolean) || []

        const glFiltered = granularLessons.filter(g => !glSearch || g.name.includes(glSearch) || (g.code && g.code.includes(glSearch)))
        const glTargetKp = glSelectTargetKp ? knowledgePoints.find(k => k.id === glSelectTargetKp) : null
        const glSelectedIds = glTargetKp?.granularLessons || []

        return (
          <div className="h-full flex flex-col">
            {/* Search Bar + Add Button */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={kpSearch}
                  onChange={e => setKpSearch(e.target.value)}
                  placeholder="搜索知识点名称、描述或编码..."
                  className="pl-9"
                />
              </div>
              <Button onClick={openAddKp}>
                <Plus className="h-4 w-4 mr-1" />新增知识点
              </Button>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
              {/* Left: Search Results */}
              <div className="w-3/5 flex flex-col min-h-0 border rounded-xl p-3">
                <p className="text-sm font-medium mb-3 text-gray-700">
                  {kpSearch ? `搜索结果 (${filteredKp.length})` : "全部知识点"}
                </p>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {!kpSearch && filteredKp.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">请输入关键词搜索知识点</p>
                    </div>
                  )}
                  {kpSearch && !hasResults && (
                    <div className="p-6 text-center text-gray-500 text-sm border border-dashed rounded-lg">
                      <p className="mb-2">未找到 "{kpSearch}" 相关的知识点</p>
                      <Button variant="outline" size="sm" onClick={openAddKp}>
                        <Plus className="h-3 w-3 mr-1" />新增此知识点
                      </Button>
                    </div>
                  )}
                  {filteredKp.map(kp => {
                    const isSelected = state.knowledgePoints.includes(kp.id)
                    const kpGlNames = kp.granularLessons?.map(gid => granularLessons.find(g => g.id === gid)?.name).filter(Boolean) || []
                    return (
                      <div key={kp.id} className={cn("p-2 rounded-lg border transition-all", isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300")}>
                        {/* Row 1: Name + Code + Granular Lessons */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm font-medium truncate max-w-[45%]">{kp.name}</span>
                          {kp.code && <Badge variant="outline" className="text-[10px] shrink-0 h-4 px-1">{kp.code}</Badge>}
                          <div className="flex items-center gap-1 flex-1 flex-wrap justify-end">
                            {kpGlNames.slice(0, 2).map((name, i) => (
                              <Badge key={i} variant="outline" className="text-[9px] font-normal px-1 py-0 h-4 cursor-pointer hover:bg-gray-100" onClick={() => openGlSelect(kp.id)}>{name}</Badge>
                            ))}
                            {kpGlNames.length > 2 && <span className="text-[9px] text-gray-400 cursor-pointer" onClick={() => openGlSelect(kp.id)}>+{kpGlNames.length - 2}</span>}
                            {kpGlNames.length === 0 && (
                              <Badge variant="outline" className="text-[9px] font-normal px-1 py-0 h-4 cursor-pointer hover:bg-gray-100 text-gray-400 border-dashed" onClick={() => openGlSelect(kp.id)}>
                                <Plus className="h-2.5 w-2.5 mr-0.5" />关联
                              </Badge>
                            )}
                          </div>
                        </div>
                        {/* Row 2: Description + Buttons */}
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11px] text-gray-500 line-clamp-1 flex-1">{kp.description}</p>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="sm" className="h-5 text-[11px] px-1.5 text-gray-400" onClick={() => { setSelectedKpForDetail(kp.id); setKpDetailOpen(true) }}>
                              详情
                            </Button>
                            {isSelected ? (
                              <Button size="sm" variant="outline" className="h-5 text-[11px] px-2" onClick={() => handleRemoveKp(kp.id)}>
                                取消
                              </Button>
                            ) : (
                              <>
                                <Button size="sm" className="h-5 text-[11px] px-2" onClick={() => handleReferenceKp(kp.id)}>
                                  引用
                                </Button>
                                <Button size="sm" variant="outline" className="h-5 text-[11px] px-2" onClick={() => openCloneKp(kp)}>
                                  克隆
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Selected Knowledge Points - Compact Grid */}
              <div className="w-2/5 border rounded-xl p-3 flex flex-col min-h-0">
                <p className="text-sm font-medium mb-3 text-gray-700">已选择知识点 ({state.knowledgePoints.length})</p>
                <div className="flex-1 overflow-y-auto">
                  {state.knowledgePoints.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">从左侧搜索并选择知识点</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {state.knowledgePoints.map(kpId => {
                        const kp = knowledgePoints.find(k => k.id === kpId)
                        if (!kp) return null
                        const isReference = !customKnowledgePointIds.has(kpId)
                        const kpGlNames = kp.granularLessons?.map(gid => granularLessons.find(g => g.id === gid)?.name).filter(Boolean) || []
                        return (
                          <div key={kpId} className={cn(
                            "p-2 rounded-lg border cursor-pointer transition-colors relative",
                            isReference
                              ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                              : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                          )} onClick={() => { setSelectedKpForDetail(kp.id); setKpDetailOpen(true) }}>
                            {/* Reference badge */}
                            {isReference && (
                              <Badge variant="secondary" className="absolute top-1 left-1 text-[9px] h-4 px-1 py-0 bg-gray-200 text-gray-600 border border-white">
                                引用
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs font-medium flex-1 truncate">{kp.name}</span>
                              <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 -mr-1 -mt-1" onClick={(e) => { e.stopPropagation(); handleRemoveKp(kpId) }}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-1 mb-1">{kp.description}</p>
                            {kpGlNames.length > 0 && (
                              <div className="flex items-center gap-0.5 flex-wrap">
                                {kpGlNames.slice(0, 2).map((name, i) => (
                                  <Badge key={i} variant="outline" className="text-[9px] font-normal px-1 py-0 h-4">{name}</Badge>
                                ))}
                                {kpGlNames.length > 2 && <span className="text-[9px] text-gray-400">+{kpGlNames.length - 2}</span>}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add / Clone Knowledge Dialog */}
            <Dialog open={kpActionOpen} onOpenChange={setKpActionOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{kpActionMode === "add" ? "新增知识点" : "克隆知识点"}</DialogTitle>
                  <DialogDescription>
                    {kpActionMode === "add" ? "创建一个新的知识点" : `基于「${kpActionTarget?.name}」创建副本`}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>知识点名称</Label>
                    <Input
                      value={newKpForm.name}
                      onChange={e => setNewKpForm({ ...newKpForm, name: e.target.value })}
                      placeholder="输入知识点名称"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>描述</Label>
                    <Textarea
                      value={newKpForm.description}
                      onChange={e => setNewKpForm({ ...newKpForm, description: e.target.value })}
                      placeholder="输入知识点描述"
                      className="mt-1.5"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>编码</Label>
                    <Input
                      value={newKpForm.code}
                      disabled
                      className="mt-1.5 bg-gray-50"
                    />
                    <p className="text-xs text-gray-400 mt-1">系统自动生成，不可修改</p>
                  </div>
                  <div>
                    <Label>关联颗粒课</Label>
                    <div className="mt-1.5">
                      {newKpForm.granularLessons.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {newKpForm.granularLessons.map(gid => {
                            const gl = granularLessons.find(g => g.id === gid)
                            return gl ? (
                              <Badge key={gid} variant="secondary" className="text-xs gap-1">
                                {gl.name}
                                <X className="h-3 w-3 cursor-pointer" onClick={() => setNewKpForm({ ...newKpForm, granularLessons: newKpForm.granularLessons.filter(x => x !== gid) })} />
                              </Badge>
                            ) : null
                          })}
                        </div>
                      ) : null}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { setGlSelectTargetKp("new-kp"); setGlSearch(""); setGlSelectOpen(true) }}>
                          <Plus className="h-3 w-3 mr-1" />选择颗粒课
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open("/granular-lessons/new", "_blank")}>
                          <Plus className="h-3 w-3 mr-1" />新建颗粒课
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setKpActionOpen(false)}>取消</Button>
                  <Button onClick={handleSaveNewKp} disabled={!newKpForm.name.trim()}>
                    {kpActionMode === "add" ? "新增并选中" : "克隆并选中"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Granular Lesson Selection Dialog */}
            <Dialog open={glSelectOpen} onOpenChange={setGlSelectOpen}>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh] h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>
                    {glTargetKp ? `为「${glTargetKp.name}」选择颗粒课` : "选择颗粒课"}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 flex-1 min-h-0 py-4">
                  {/* Left: All granular lessons */}
                  <div className="w-3/5 flex flex-col min-h-0 border rounded-xl p-3">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={glSearch}
                        onChange={e => setGlSearch(e.target.value)}
                        placeholder="搜索颗粒课名称或编码..."
                        className="pl-9"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {glFiltered.map(gl => {
                        const isSelected = glSelectedIds.includes(gl.id)
                        return (
                          <div key={gl.id} className={cn("p-3 rounded-lg border cursor-pointer transition-all", isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300")} onClick={() => {
                            if (glSelectTargetKp === "new-kp") {
                              setNewKpForm(prev => {
                                const current = prev.granularLessons
                                const updated = current.includes(gl.id) ? current.filter(x => x !== gl.id) : [...current, gl.id]
                                return { ...prev, granularLessons: updated }
                              })
                            } else {
                              handleToggleGlForKp(gl.id)
                            }
                          }}>
                            <div className="flex items-center gap-2">
                              <div className={cn("w-4 h-4 rounded border flex items-center justify-center", isSelected ? "bg-primary border-primary" : "border-gray-300")}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className="text-sm font-medium flex-1">{gl.name}</span>
                              {gl.code && <Badge variant="outline" className="text-[10px]">{gl.code}</Badge>}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-6">{gl.description}</p>
                          </div>
                        )
                      })}
                      {glFiltered.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          <p className="text-sm">未找到匹配的颗粒课</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Selected */}
                  <div className="w-2/5 border rounded-xl p-3 flex flex-col min-h-0">
                    <p className="text-sm font-medium mb-3 text-gray-700">已选择 ({glSelectedIds.length})</p>
                    <div className="flex-1 overflow-y-auto space-y-2">
                      {glSelectedIds.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                          <p className="text-xs">从左侧选择颗粒课</p>
                        </div>
                      ) : (
                        glSelectedIds.map(gid => {
                          const gl = granularLessons.find(g => g.id === gid)
                          if (!gl) return null
                          return (
                            <div key={gid} className="flex items-center gap-2 p-2 rounded border bg-gray-50">
                              <span className="text-sm flex-1 truncate">{gl.name}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={() => {
                                if (glSelectTargetKp === "new-kp") {
                                  setNewKpForm(prev => ({ ...prev, granularLessons: prev.granularLessons.filter(x => x !== gid) }))
                                } else {
                                  handleToggleGlForKp(gid)
                                }
                              }}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setGlSelectOpen(false)}>确定</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Knowledge Point Detail Dialog */}
            <Dialog open={kpDetailOpen} onOpenChange={setKpDetailOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>知识点详情</DialogTitle>
                </DialogHeader>
                {detailKp && (
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-500">知识点名称</Label>
                      {!customKnowledgePointIds.has(detailKp.id) && (
                        <Badge variant="secondary" className="text-[10px] h-5">引用（不可编辑）</Badge>
                      )}
                      {customKnowledgePointIds.has(detailKp.id) && (
                        <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">自定义（可编辑）</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{detailKp.name}</p>
                    <div>
                      <Label className="text-xs text-gray-500">知识点描述</Label>
                      <p className="text-sm text-gray-700 mt-1">{detailKp.description}</p>
                    </div>
                    {detailKp.code && (
                      <div>
                        <Label className="text-xs text-gray-500">编码</Label>
                        <p className="text-sm text-gray-700 mt-1">{detailKp.code}</p>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-500">关联颗粒课</Label>
                        {customKnowledgePointIds.has(detailKp.id) && (
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary" onClick={() => { setKpDetailOpen(false); openGlSelect(detailKp.id) }}>
                              引用颗粒课
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary" onClick={() => window.open("/granular-lessons/new", "_blank")}>
                              新增颗粒课
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {detailGranularLessons.length > 0 ? detailGranularLessons.map(gl => (
                          <Badge key={gl!.id} variant="outline" className="text-xs">{gl!.name}</Badge>
                        )) : <p className="text-sm text-gray-400">暂无关联颗粒课</p>}
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )
      }

      case "ability": {
        // abilityDetailOpen, selectedAbilityForDetail, expandedDomains, abilitySearch are defined at component top level

        // Build position name map
        const positionNameMap: Record<string, string> = {}
        professions.forEach(p => p.positions.forEach(pos => { positionNameMap[pos.id] = pos.name }))

        // Filter abilities related to current position
        const relatedAbilities = positionId
          ? abilityPoints.filter(ab => ab.positionIds?.includes(positionId))
          : abilityPoints

        const toggleAbility = (abId: string) => {
          const selected = state.abilityPoints.includes(abId)
          updateState({ abilityPoints: selected ? state.abilityPoints.filter(x => x !== abId) : [...state.abilityPoints, abId] })
        }

        // Group by domain
        const domainGroups = relatedAbilities.reduce((acc, ab) => {
          const domain = ab.domain || "其他"
          if (!acc[domain]) acc[domain] = []
          acc[domain].push(ab)
          return acc
        }, {} as Record<string, typeof relatedAbilities>)

        const detailAb = selectedAbilityForDetail ? abilityPoints.find(a => a.id === selectedAbilityForDetail) : null

        const requiredLevelColors: Record<string, string> = {
          "了解": "bg-gray-100 text-gray-600 border-gray-200",
          "理解": "bg-blue-50 text-blue-600 border-blue-200",
          "掌握": "bg-green-50 text-green-600 border-green-200",
          "熟练": "bg-orange-50 text-orange-600 border-orange-200",
          "精通": "bg-purple-50 text-purple-600 border-purple-200",
        }

        const domainIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
          "前端工程化": Code,
          "系统设计": Database,
          "质量保障": Shield,
          "职业素养": Users,
          "服务端开发": Server,
          "运维部署": Wrench,
          "数据分析": BookOpen,
        }

        const categoryColors: Record<string, string> = {
          "开发能力": "bg-blue-50 text-blue-600 border-blue-200",
          "设计能力": "bg-purple-50 text-purple-600 border-purple-200",
          "优化能力": "bg-green-50 text-green-600 border-green-200",
          "软技能": "bg-orange-50 text-orange-600 border-orange-200",
          "分析能力": "bg-cyan-50 text-cyan-600 border-cyan-200",
          "工程能力": "bg-indigo-50 text-indigo-600 border-indigo-200",
        }

        return (
          <div className="h-full flex flex-col">
            {/* Header bar */}
            <div className="flex items-center gap-4 mb-4 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input value={abilitySearch} onChange={e => setAbilitySearch(e.target.value)} placeholder="搜索能力点名称、编码或描述..." className="pl-9" />
              </div>
              <div className="text-sm text-gray-500 shrink-0">
                共 <span className="font-medium text-gray-800">{relatedAbilities.length}</span> 个关联能力点，已选 <span className="font-medium text-primary">{state.abilityPoints.length}</span> 个
              </div>
            </div>

            <div className="flex-1 min-h-0 border rounded-xl overflow-hidden">
              <div className="h-full overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
                {Object.entries(domainGroups).map(([domain, abilities]) => {
                  const filtered = abilities.filter(a =>
                    !abilitySearch ||
                    a.name.includes(abilitySearch) ||
                    a.description.includes(abilitySearch) ||
                    (a.code && a.code.includes(abilitySearch))
                  )
                  if (filtered.length === 0) return null
                  const expanded = expandedDomains[domain] !== false
                  const DomainIcon = domainIconMap[domain] || Award
                  return (
                    <div key={domain} className="border rounded-xl overflow-hidden bg-white flex flex-col">
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-sky-50 text-sm font-semibold text-sky-700 hover:bg-sky-100 transition-colors shrink-0"
                        onClick={() => setExpandedDomains(prev => ({ ...prev, [domain]: !expanded }))}
                      >
                        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <DomainIcon className="h-4 w-4" />
                        <span className="flex-1 text-left truncate">{domain}</span>
                        <Badge className="text-[10px] bg-white text-sky-600 border-sky-200 shrink-0">{filtered.length} 个能力点</Badge>
                      </button>
                      {expanded && (
                        <div className="divide-y divide-gray-100">
                          {filtered.map(ab => {
                            const selected = state.abilityPoints.includes(ab.id)
                            const positionNames = ab.positionIds?.map(pid => positionNameMap[pid]).filter(Boolean) || []
                            return (
                              <div
                                key={ab.id}
                                onClick={() => toggleAbility(ab.id)}
                                className={cn(
                                  "px-4 py-2.5 cursor-pointer transition-colors group",
                                  selected
                                    ? "bg-primary/[0.03] border-l-2 border-l-primary"
                                    : "hover:bg-gray-50 border-l-2 border-l-transparent"
                                )}
                              >
                                {/* Row 1: checkbox + name + code + badges */}
                                <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                                    selected ? "bg-primary border-primary" : "border-gray-300 group-hover:border-gray-400"
                                  )}>
                                    {selected && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <span className="text-sm font-medium text-gray-800 truncate">{ab.name}</span>
                                  {ab.code && <span className="text-[11px] text-gray-400 font-mono shrink-0">{ab.code}</span>}
                                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                    {ab.requiredLevel && (
                                      <Badge variant="outline" className={cn("text-[10px] font-medium h-5 px-1", requiredLevelColors[ab.requiredLevel] || "")}>
                                        要求：{ab.requiredLevel}
                                      </Badge>
                                    )}
                                    {ab.category && (
                                      <Badge variant="outline" className={cn("text-[10px] font-normal h-5 px-1.5", categoryColors[ab.category] || "border-gray-200 text-gray-500")}>
                                        {ab.category}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                {/* Row 2: description + positions */}
                                <div className="flex items-center gap-2 mt-1 ml-6">
                                  <p className="text-xs text-gray-500 line-clamp-1 flex-1">{ab.description}</p>
                                  {positionNames.length > 0 && (
                                    <div className="flex items-center gap-1 shrink-0">
                                      {positionNames.slice(0, 2).map((name, i) => (
                                        <Badge key={i} variant="secondary" className="text-[10px] font-normal bg-gray-100 text-gray-600 h-5 px-1">
                                          {name}
                                        </Badge>
                                      ))}
                                      {positionNames.length > 2 && (
                                        <span className="text-[10px] text-gray-400">+{positionNames.length - 2}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
                {Object.entries(domainGroups).filter(([_, abilities]) =>
                  abilities.some(a =>
                    !abilitySearch ||
                    a.name.includes(abilitySearch) ||
                    a.description.includes(abilitySearch) ||
                    (a.code && a.code.includes(abilitySearch))
                  )
                ).length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-16">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">未找到匹配的能力点</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ability Detail Dialog */}
            <Dialog open={abilityDetailOpen} onOpenChange={setAbilityDetailOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>能力点详情</DialogTitle>
                </DialogHeader>
                {detailAb && (
                  <div className="space-y-4 py-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-semibold">{detailAb.name}</p>
                      {detailAb.code && <Badge variant="outline" className="font-mono">{detailAb.code}</Badge>}
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
                      <Label className="text-xs text-gray-500">关联岗位</Label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(detailAb.positionIds?.map(pid => positionNameMap[pid]).filter(Boolean) || []).map((name, i) => (
                          <Badge key={i} variant="secondary">{name}</Badge>
                        ))}
                        {(!detailAb.positionIds || detailAb.positionIds.length === 0) && <span className="text-sm text-gray-400">-</span>}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">掌握程度要求</Label>
                      <p className="text-sm text-gray-700 mt-1">{detailAb.requiredLevel || "-"}</p>
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
        const types = ["all", "document", "spreadsheet", "image", "link", "audio", "video", "archive", "tool", "venue", "facility", "software", "other"]
        const filteredRes = learningResources.filter(r => {
          const matchType = resType === "all" || r.type === resType
          const matchName = !resSearchName || r.name.includes(resSearchName)
          const matchProvider = !resSearchProvider || r.uploadedBy.includes(resSearchProvider)
          return matchType && matchName && matchProvider
        })

        const toggleResource = (rid: string) => {
          const selected = state.resources.includes(rid)
          updateState({ resources: selected ? state.resources.filter(x => x !== rid) : [...state.resources, rid] })
        }

        const resetFilters = () => {
          setResType("all")
          setResSearchName("")
          setResSearchProvider("")
        }

        return (
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="shrink-0 space-y-3 mb-4">
              {/* Type filters */}
              <div className="flex gap-1.5 flex-wrap">
                {types.map(t => (
                  <Button
                    key={t}
                    variant={resType === t ? "default" : "outline"}
                    size="sm"
                    className={cn("text-xs h-7", resType === t ? "" : "bg-white")}
                    onClick={() => setResType(t)}
                  >
                    {resourceTypeIcons[t] && <span className="mr-1.5">{resourceTypeIcons[t]}</span>}
                    {resourceTypeLabels[t] || t}
                  </Button>
                ))}
              </div>
              {/* Search & Actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={resSearchName}
                    onChange={e => setResSearchName(e.target.value)}
                    placeholder="搜索资源名称..."
                    className="pl-9 text-sm"
                  />
                </div>
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={resSearchProvider}
                    onChange={e => setResSearchProvider(e.target.value)}
                    placeholder="搜索资源提供者..."
                    className="pl-9 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 text-xs" onClick={resetFilters}>
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />重置
                </Button>
                <Button size="sm" className="h-9 text-xs" onClick={() => setShowUploadRes(true)}>
                  <Upload className="h-3.5 w-3.5 mr-1" />上传资源
                </Button>
              </div>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
              {/* Left: Resource cards grid */}
              <div className="flex-1 flex flex-col min-h-0 border rounded-xl p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <p className="text-sm font-medium text-gray-700">
                    资源列表 <span className="text-gray-400 font-normal">({filteredRes.length})</span>
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredRes.length === 0 ? (
                    <div className="text-center text-gray-400 py-16">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">未找到匹配的资源</p>
                      <p className="text-xs mt-1">尝试调整筛选条件</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filteredRes.map(r => {
                        const selected = state.resources.includes(r.id)
                        return (
                          <div
                            key={r.id}
                            className={cn(
                              "relative rounded-lg border overflow-hidden transition-all cursor-pointer group",
                              selected
                                ? "border-primary shadow-sm ring-1 ring-primary/10"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white"
                            )}
                          >
                            {/* Thumbnail area */}
                            <div className="relative h-20 bg-gray-50 border-b border-gray-100 overflow-hidden">
                              {r.thumbnail && r.type === "image" ? (
                                <img src={r.thumbnail} alt={r.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className={cn("p-2 rounded-lg border", resourceTypeColors[r.type] || "bg-gray-50 border-gray-200")}>
                                    {resourceTypeIcons[r.type] || <Package className="h-5 w-5 text-gray-400" />}
                                  </div>
                                </div>
                              )}
                              {selected && (
                                <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-0.5 shadow-sm">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </div>
                              )}
                              {/* Type badge */}
                              <div className="absolute bottom-1.5 left-1.5">
                                <Badge className={cn("text-[9px] border", resourceTypeColors[r.type] || "")}>
                                  {resourceTypeLabels[r.type] || r.type}
                                </Badge>
                              </div>
                            </div>
                            {/* Info */}
                            <div className="p-2" onClick={() => toggleResource(r.id)}>
                              <p className="text-xs font-medium text-gray-800 truncate mb-1">{r.name}</p>
                              <div className="flex items-center justify-between text-[11px] text-gray-500">
                                <span className="flex items-center gap-1 truncate max-w-[80px]">
                                  <Users className="h-3 w-3 shrink-0" />{r.uploadedBy}
                                </span>
                                <span className="shrink-0">{r.uploadedAt}</span>
                              </div>
                            </div>
                            {/* Actions */}
                            <div className="px-2 pb-2 flex items-center gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[10px] px-1.5 flex-1 text-gray-500 hover:text-primary"
                                onClick={(e) => { e.stopPropagation(); window.open(r.url || "#", "_blank") }}
                              >
                                <Eye className="h-3 w-3 mr-0.5" />预览
                              </Button>
                              <Button
                                variant={selected ? "outline" : "default"}
                                size="sm"
                                className="h-6 text-[10px] px-1.5 flex-1"
                                onClick={(e) => { e.stopPropagation(); toggleResource(r.id) }}
                              >
                                {selected ? "取消" : "选择"}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Selected resources sidebar */}
              <div className="w-72 shrink-0 flex flex-col min-h-0 border rounded-xl p-4 bg-gray-50/50 overflow-hidden">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <p className="text-sm font-semibold text-gray-700">已选资源</p>
                  <Badge variant="secondary" className="text-[10px]">{state.resources.length}</Badge>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                  {state.resources.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">请从左侧选择资源</p>
                    </div>
                  ) : (
                    state.resources.map(rid => {
                      const r = learningResources.find(res => res.id === rid)
                      if (!r) return null
                      return (
                        <div key={rid} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-primary/20 bg-white shadow-sm">
                          <div className={cn("w-9 h-9 rounded-lg border flex items-center justify-center shrink-0", resourceTypeColors[r.type] || "bg-gray-50")}>
                            {resourceTypeIcons[r.type] || <Package className="h-4 w-4 text-gray-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate text-gray-800">{r.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{r.uploadedBy} · {r.uploadedAt}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-500 shrink-0" onClick={() => toggleResource(rid)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Upload Resource Dialog */}
            <Dialog open={showUploadRes} onOpenChange={setShowUploadRes}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>上传资源到公共库</DialogTitle>
                  <DialogDescription>补充本地资源，上传后将加入资源公共库并自动选中</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>资源名称</Label>
                    <Input value={newResName} onChange={e => setNewResName(e.target.value)} placeholder="输入资源名称" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>资源类型</Label>
                    <Select value={newResType} onValueChange={v => setNewResType(v)}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">文档资源</SelectItem>
                        <SelectItem value="spreadsheet">表格资源</SelectItem>
                        <SelectItem value="image">图片资源</SelectItem>
                        <SelectItem value="link">链接资源</SelectItem>
                        <SelectItem value="audio">音频资源</SelectItem>
                        <SelectItem value="video">视频资源</SelectItem>
                        <SelectItem value="archive">压缩包资源</SelectItem>
                        <SelectItem value="tool">软件工具资源</SelectItem>
                        <SelectItem value="venue">场地资源</SelectItem>
                        <SelectItem value="facility">设施设备资源</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">点击或拖拽上传文件</p>
                      <p className="text-xs text-gray-500 mt-1">支持多种格式，最大 100MB</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowUploadRes(false)}>取消</Button>
                  <Button onClick={handleUploadResource} disabled={!newResName.trim()}>上传并选中</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

      case "evaluationRules": {
        const activeMethod = erActiveMethod
        const setActiveMethod = setErActiveMethod
        const activeStep = erActiveStep
        const setActiveStep = setErActiveStep
        const qSearch = erQSearch
        const setQSearch = setErQSearch
        const pSearch = erPSearch
        const setPSearch = setErPSearch
        const kpSearchForEval = erKpSearch
        const setKpSearchForEval = setErKpSearch

        const steps = ["测评对象", "测评主体", "评价方式与测评资源", "评价方法"]

        const subjectLabels: Record<string, string> = {
          teacher: "教师",
          enterprise_mentor: "企业导师",
          peer: "同伴",
          self: "自评",
          ai: "AI",
          service_target: "服务对象",
        }

        const getMethodConfigSummary = (methodKey: string) => {
          switch (methodKey) {
            case "random_draw":
              return { title: "现场抽题", summary: `${state.randomDrawQuestions.length} 题 / ${state.randomDrawEvalPoints.length} 个评价点`, configured: state.randomDrawQuestions.length > 0 || state.randomDrawEvalPoints.length > 0 }
            case "review":
              return { title: "评审", summary: `${state.reviewEvalPoints.length} 个评价点`, configured: state.reviewEvalPoints.length > 0 }
            case "paper":
              return { title: "试卷", summary: state.paperId ? paperMocks.find(p => p.id === state.paperId)?.name || "已选择" : "未选择", configured: !!state.paperId }
            case "question_bank":
              return { title: "题库", summary: `${state.questionBankQuestions.length} 题`, configured: state.questionBankQuestions.length > 0 }
            default: return { title: "", summary: "", configured: false }
          }
        }

        const updateEvalSubject = (idx: number, updates: Partial<EvalSubjectConfig>) => {
          const newSubjects = [...state.evalSubjects]
          newSubjects[idx] = { ...newSubjects[idx], ...updates }
          updateState({ evalSubjects: newSubjects })
        }

        const addEvalPoint = (field: "randomDrawEvalPoints" | "reviewEvalPoints") => {
          if (!newPointName.trim()) return
          const newPoint: EvalPoint = { id: `ep-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, name: newPointName.trim(), desc: "" }
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

        const updateEvalPoint = (field: "randomDrawEvalPoints" | "reviewEvalPoints", id: string, updates: Partial<EvalPoint>) => {
          if (field === "randomDrawEvalPoints") {
            updateState({ randomDrawEvalPoints: state.randomDrawEvalPoints.map(p => p.id === id ? { ...p, ...updates } : p) })
          } else {
            updateState({ reviewEvalPoints: state.reviewEvalPoints.map(p => p.id === id ? { ...p, ...updates } : p) })
          }
        }

        const toggleQuestion = (qid: string, field: "randomDrawQuestions" | "questionBankQuestions") => {
          const arr = field === "randomDrawQuestions" ? state.randomDrawQuestions : state.questionBankQuestions
          const exists = arr.includes(qid)
          const newArr = exists ? arr.filter(x => x !== qid) : [...arr, qid]
          if (field === "randomDrawQuestions") updateState({ randomDrawQuestions: newArr })
          else updateState({ questionBankQuestions: newArr })
        }

        const EvalPointConfigPanel = ({ points, field }: { points: EvalPoint[]; field: "randomDrawEvalPoints" | "reviewEvalPoints" }) => (
          <div className="border rounded-xl p-4">
            <p className="text-sm font-medium mb-3">评价点配置</p>
            <div className="space-y-3">
              {points.map(ep => (
                <div key={ep.id} className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Input value={ep.name} onChange={e => updateEvalPoint(field, ep.id, { name: e.target.value })} className="flex-1 h-8 text-sm" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => removeEvalPoint(field, ep.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Select value={ep.subType || ""} onValueChange={v => updateEvalPoint(field, ep.id, { subType: v as EvalSubType })}>
                      <SelectTrigger className="h-8 text-xs w-44">
                        <SelectValue placeholder="选择细分类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(evalSubTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {ep.subType && <Badge variant="outline" className={cn("text-[10px]", evalSubTypeColors[ep.subType])}>{evalSubTypeLabels[ep.subType]}</Badge>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">关联知识点</p>
                    <div className="flex flex-wrap gap-1">
                      {(ep.knowledgePointIds || []).map(kpid => {
                        const kp = knowledgePoints.find(k => k.id === kpid)
                        return kp ? (
                          <Badge key={kpid} variant="secondary" className="text-[10px] font-normal">
                            {kp.name}
                            <button onClick={() => updateEvalPoint(field, ep.id, { knowledgePointIds: (ep.knowledgePointIds || []).filter(id => id !== kpid) })} className="ml-1 text-gray-400 hover:text-red-500">×</button>
                          </Badge>
                        ) : null
                      })}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-gray-400 hover:text-primary">+ 添加知识点</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader><DialogTitle>关联知识点</DialogTitle></DialogHeader>
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input value={kpSearchForEval} onChange={e => setKpSearchForEval(e.target.value)} placeholder="搜索知识点..." className="pl-9" />
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {knowledgePoints.filter(k => !kpSearchForEval || k.name.includes(kpSearchForEval)).map(k => {
                              const alreadyLinked = (ep.knowledgePointIds || []).includes(k.id)
                              return (
                                <div key={k.id} onClick={() => {
                                  if (alreadyLinked) return
                                  updateEvalPoint(field, ep.id, { knowledgePointIds: [...(ep.knowledgePointIds || []), k.id] })
                                }} className={cn("p-2 rounded-lg border cursor-pointer text-sm", alreadyLinked ? "border-primary bg-primary/5 opacity-50" : "hover:border-gray-300")}>
                                  <div className="flex items-center gap-2">
                                    <span className="flex-1">{k.name}</span>
                                    {alreadyLinked && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Input value={newPointName} onChange={e => setNewPointName(e.target.value)} placeholder="输入评价点名称" className="flex-1 h-9" />
                <Button size="sm" onClick={() => addEvalPoint(field)}>添加</Button>
              </div>
            </div>
          </div>
        )

        const EvalResourcePanel = ({ methodKey }: { methodKey: string }) => {
          if (methodKey === "random_draw") {
            return (
              <div className="space-y-4">
                <div className="border rounded-xl p-4">
                  <p className="text-sm font-medium mb-3">题目范围（从题库选择）</p>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input value={qSearch} onChange={e => setQSearch(e.target.value)} placeholder="搜索题目..." className="pl-9" />
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
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
                <EvalPointConfigPanel points={state.randomDrawEvalPoints} field="randomDrawEvalPoints" />
              </div>
            )
          }
          if (methodKey === "review") {
            return (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-700 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4" />
                    <span className="font-medium">评审说明</span>
                  </div>
                  <p>评审时教师根据学生现场表现或提交的材料进行打分。</p>
                </div>
                <EvalPointConfigPanel points={state.reviewEvalPoints} field="reviewEvalPoints" />
              </div>
            )
          }
          if (methodKey === "paper") {
            return (
              <div className="space-y-4">
                <div className="border rounded-xl p-4">
                  <p className="text-sm font-medium mb-3">选择已有试卷</p>
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
              </div>
            )
          }
          if (methodKey === "question_bank") {
            return (
              <div className="space-y-4">
                <div className="border rounded-xl p-4">
                  <p className="text-sm font-medium mb-3">从题库选题组成测评资源</p>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input value={qSearch} onChange={e => setQSearch(e.target.value)} placeholder="搜索题目..." className="pl-9" />
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
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
              </div>
            )
          }
          return null
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
              <div className="flex gap-4 flex-1 min-h-0">
                {/* Left: Method list */}
                <div className="w-64 shrink-0 flex flex-col min-h-0 border rounded-xl p-3 overflow-hidden">
                  <p className="text-sm font-semibold mb-3 text-gray-700">评价方式列表</p>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {state.evaluationMethods.map(methodKey => {
                      const method = evaluationMethodOptions.find(o => o.key === methodKey)
                      if (!method) return null
                      const isActive = activeMethod === methodKey
                      const summary = getMethodConfigSummary(methodKey)
                      return (
                        <button
                          key={methodKey}
                          onClick={() => { setActiveMethod(methodKey); setActiveStep(0) }}
                          className={cn("w-full flex items-center gap-2 p-3 rounded-lg border text-left transition-all", isActive ? "border-primary bg-primary/[0.03]" : "border-gray-200 hover:border-gray-300 bg-white")}
                        >
                          <div className={cn("p-1.5 rounded", method.color)}>{method.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{method.label}</p>
                            <p className="text-[11px] text-gray-400 truncate">{summary.configured ? "已配置" : "待配置"}</p>
                          </div>
                          {summary.configured && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Right: Step configuration */}
                <div className="flex-1 flex flex-col min-h-0 border rounded-xl overflow-hidden">
                  {/* Step tabs */}
                  <div className="flex border-b shrink-0">
                    {steps.map((step, idx) => (
                      <button
                        key={step}
                        onClick={() => setActiveStep(idx)}
                        className={cn("flex-1 py-3 text-sm font-medium transition-colors relative", activeStep === idx ? "text-primary" : "text-gray-500 hover:text-gray-700")}
                      >
                        <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2", activeStep === idx ? "bg-primary text-white" : "bg-gray-100 text-gray-500")}>
                          {idx + 1}
                        </span>
                        {step}
                        {activeStep === idx && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                      </button>
                    ))}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {activeStep === 0 && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500 mb-4">选择本任务的测评对象类型</p>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { key: "individual", label: "个人", desc: "以学生个人为单位进行测评" },
                            { key: "group", label: "小组", desc: "以小组为单位进行测评" },
                            { key: "individual_and_group", label: "个人+小组", desc: "同时考核个人和小组表现" },
                          ].map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => updateState({ evalObject: opt.key as EvalObjectType })}
                              className={cn("p-5 rounded-xl border text-left transition-all", state.evalObject === opt.key ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300 bg-white")}
                            >
                              <p className="text-sm font-semibold mb-1">{opt.label}</p>
                              <p className="text-xs text-gray-400">{opt.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500 mb-4">配置参与测评的主体及其参数</p>
                        <div className="space-y-3">
                          {state.evalSubjects.map((subject, idx) => (
                            <div key={subject.type} className={cn("p-4 rounded-xl border transition-all", subject.enabled ? "border-primary bg-primary/[0.03]" : "border-gray-200 bg-white")}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Switch checked={subject.enabled} onCheckedChange={v => updateEvalSubject(idx, { enabled: v })} />
                                  <span className="text-sm font-medium">{subjectLabels[subject.type]}</span>
                                </div>
                              </div>
                              {subject.enabled && (
                                <div className="pl-12 space-y-3">
                                  {subject.type === "teacher" && (
                                    <>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <Label className="text-xs text-gray-500">专业背景要求</Label>
                                          <Input value={subject.params?.teacherBackground || ""} onChange={e => updateEvalSubject(idx, { params: { ...subject.params, teacherBackground: e.target.value } })} placeholder="例如：计算机相关专业" className="mt-1 text-sm" />
                                        </div>
                                        <div>
                                          <Label className="text-xs text-gray-500">评分人数</Label>
                                          <Input type="number" value={subject.params?.scorerCount || 1} onChange={e => updateEvalSubject(idx, { params: { ...subject.params, scorerCount: Math.max(1, parseInt(e.target.value) || 1) } })} className="mt-1 text-sm" min={1} />
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Switch checked={subject.params?.requiresEnterpriseMentor || false} onCheckedChange={v => updateEvalSubject(idx, { params: { ...subject.params, requiresEnterpriseMentor: v } })} />
                                        <span className="text-xs text-gray-600">需要企业导师参与</span>
                                      </div>
                                    </>
                                  )}
                                  {subject.type === "peer" && (
                                    <div>
                                      <Label className="text-xs text-gray-500">互评人数</Label>
                                      <Input type="number" value={subject.params?.peerCount || 3} onChange={e => updateEvalSubject(idx, { params: { ...subject.params, peerCount: Math.max(1, parseInt(e.target.value) || 1) } })} className="mt-1 text-sm w-32" min={1} />
                                    </div>
                                  )}
                                  {subject.type === "ai" && (
                                    <div>
                                      <Label className="text-xs text-gray-500">AI 模型</Label>
                                      <Input value={subject.params?.aiModel || ""} onChange={e => updateEvalSubject(idx, { params: { ...subject.params, aiModel: e.target.value } })} placeholder="例如：GPT-4" className="mt-1 text-sm" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeStep === 2 && activeMethod && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">
                            配置 {evaluationMethodOptions.find(o => o.key === activeMethod)?.label} 的测评资源
                          </p>
                        </div>
                        <EvalResourcePanel methodKey={activeMethod} />
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium mb-2">等级转换规则配置</p>
                        <div className="h-10 bg-gray-100 rounded-lg overflow-hidden flex mb-4">
                          {[...state.gradeMapping].sort((a, b) => a.minScore - b.minScore).map(grade => {
                            const width = grade.maxScore - grade.minScore + 1
                            return (
                              <div key={grade.id} className={cn("flex items-center justify-center text-white font-medium text-sm transition-all", grade.color)} style={{ width: `${width}%` }}>
                                {grade.grade}
                              </div>
                            )
                          })}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[...state.gradeMapping].sort((a, b) => b.maxScore - a.maxScore).map((grade, index) => {
                            const gradeColors = [
                              { light: "bg-green-50 border-green-200 text-green-700" },
                              { light: "bg-blue-50 border-blue-200 text-blue-700" },
                              { light: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                              { light: "bg-red-50 border-red-200 text-red-700" },
                            ]
                            const colorConfig = gradeColors[index % gradeColors.length]
                            return (
                              <div key={grade.id} className={cn("rounded-lg border p-4 transition-all", colorConfig.light)}>
                                <div className="flex items-center justify-between mb-3">
                                  <Input value={grade.grade} onChange={e => updateState({ gradeMapping: state.gradeMapping.map(g => g.id === grade.id ? { ...g, grade: e.target.value } : g) })} className="w-20 h-8 text-center font-semibold" />
                                  <div className={cn("w-4 h-4 rounded-full", grade.color)} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input type="number" value={grade.minScore} onChange={e => updateState({ gradeMapping: state.gradeMapping.map(g => g.id === grade.id ? { ...g, minScore: parseInt(e.target.value) || 0 } : g) })} className="w-16 h-7 text-center text-sm" min={0} max={100} />
                                  <span className="text-gray-500">-</span>
                                  <Input type="number" value={grade.maxScore} onChange={e => updateState({ gradeMapping: state.gradeMapping.map(g => g.id === grade.id ? { ...g, maxScore: parseInt(e.target.value) || 0 } : g) })} className="w-16 h-7 text-center text-sm" min={0} max={100} />
                                  <span className="text-sm text-gray-500">分</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
    }
  }

  const isFullScreen = cardType === "evaluationRules" || cardType === "weight" || cardType === "evaluation" || cardType === "knowledge" || cardType === "ability" || cardType === "resources"
  const dialogSizeClass =
    isFullScreen
      ? "sm:max-w-[95vw] max-h-[95vh] h-[95vh]"
      : cardType === "description"
        ? "sm:max-w-[900px] max-h-[90vh]"
        : cardType === "info"
          ? "sm:max-w-[650px] max-h-[85vh]"
          : "sm:max-w-[550px] max-h-[85vh]"

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={cn(
        "flex flex-col overflow-hidden",
        dialogSizeClass
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
