"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Wand2,
  X,
  Check,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ImageIcon,
  ImagePlus,
  RefreshCw,
  List,
  ListOrdered,
  Search,
  UserPlus,
  BookOpen,
  Zap,
  FolderOpen,
  ClipboardCheck,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { professions, batches, industries, allTeachers } from "@/lib/mock-data"

// ------------------------------------------------------------------
// Mock data
// ------------------------------------------------------------------

const POSITION_OPTIONS = [
  "前端开发工程师",
  "后端开发工程师",
  "全栈开发工程师",
  "产品经理",
  "UI设计师",
  "数据分析师",
  "运维工程师",
  "测试工程师",
]

const INDUSTRY_OPTIONS = [
  "互联网",
  "金融科技",
  "电商零售",
  "教育培训",
  "医疗健康",
  "智能制造",
  "政务办公",
]

const MAJOR_OPTIONS = [
  "软件工程",
  "计算机科学",
  "信息与计算科学",
  "数字媒体技术",
  "网络工程",
  "人工智能",
]

const MOCK_SCENARIOS = [
  {
    id: "s1",
    name: "中型电商全栈开发实战",
    difficulty: 4,
    intro:
      "基于微服务架构的电商全栈开发实践，涵盖商品管理、订单系统、支付网关及前端商城页面开发，适合有一定基础的全栈开发者深入实战。",
    industries: ["电商零售", "互联网"],
    majors: ["软件工程", "计算机科学"],
  },
  {
    id: "s2",
    name: "金融风控数据可视化平台",
    difficulty: 5,
    intro:
      "构建金融风控数据可视化平台，实现实时交易监控、风险预警仪表盘、多维度数据报表，涉及大数据处理与前端可视化技术。",
    industries: ["金融科技", "互联网"],
    majors: ["数据分析师", "计算机科学"],
  },
  {
    id: "s3",
    name: "智慧医疗预约挂号系统",
    difficulty: 3,
    intro:
      "面向三甲医院的预约挂号系统，包含科室管理、医生排班、号源预约、就诊提醒等核心模块，注重高并发与数据一致性。",
    industries: ["医疗健康", "政务办公"],
    majors: ["软件工程", "网络工程"],
  },
  {
    id: "s4",
    name: "在线教育直播课堂平台",
    difficulty: 4,
    intro:
      "支持万人并发的在线直播课堂系统，涵盖实时音视频、互动白板、弹幕聊天、课程录制回放等核心功能。",
    industries: ["教育培训", "互联网"],
    majors: ["数字媒体技术", "计算机科学"],
  },
  {
    id: "s5",
    name: "智能制造设备监控大屏",
    difficulty: 3,
    intro:
      "工业物联网设备监控可视化大屏，接入PLC设备数据，实现产线状态实时监控、异常预警、生产效率分析。",
    industries: ["智能制造"],
    majors: ["人工智能", "网络工程"],
  },
]

const MOCK_TASKS = [
  {
    id: "t1",
    name: "需求分析与原型设计",
    type: "训练" as const,
    hours: 8,
    difficulty: 2,
    background:
      "通过访谈和调研收集业务需求，绘制用户旅程图，使用Figma完成高保真原型设计。",
  },
  {
    id: "t2",
    name: "数据库设计与建模",
    type: "考核" as const,
    hours: 6,
    difficulty: 3,
    background:
      "根据业务需求设计ER图，完成MySQL物理模型设计，编写DDL脚本并建立索引优化策略。",
  },
  {
    id: "t3",
    name: "后端API接口开发",
    type: "训练" as const,
    hours: 16,
    difficulty: 4,
    background:
      "使用Spring Boot / NestJS 构建RESTful API，实现JWT认证、全局异常处理及Swagger文档。",
  },
  {
    id: "t4",
    name: "前端组件化开发",
    type: "训练" as const,
    hours: 14,
    difficulty: 3,
    background:
      "基于React/Vue组件库搭建页面，实现响应式布局、状态管理及前端性能优化。",
  },
  {
    id: "t5",
    name: "系统联调与接口测试",
    type: "考核" as const,
    hours: 8,
    difficulty: 3,
    background:
      "使用Postman/JMeter进行接口压力测试，定位并修复前后端联调中的数据格式与性能问题。",
  },
  {
    id: "t6",
    name: "部署上线与运维监控",
    type: "训练" as const,
    hours: 6,
    difficulty: 4,
    background:
      "配置Docker容器化部署，使用Nginx负载均衡，接入Prometheus + Grafana监控告警。",
  },
]

const GENERATED_CONTENT_MOCK: Record<string, string> = {
  生成配置任务说明: "任务目标：完成核心业务模块的开发与调试。\n前置条件：已完成环境搭建与依赖安装。\n执行步骤：1. 阅读需求文档 2. 编写代码 3. 自测并提交。\n验收标准：功能通过全部测试用例，代码覆盖率≥80%。",
  生成关联知识点: "相关知识点：\n- RESTful API 设计规范\n- OAuth2.0 认证流程\n- 数据库事务与隔离级别\n- 前端状态管理（Redux/Vuex）\n- Docker 容器化基础",
  生成关联能力点: "能力点映射：\n- 系统分析与设计能力（L3）\n- 编码实现能力（L4）\n- 问题排查与调试能力（L3）\n- 团队协作与沟通能力（L2）",
  生成关联任务资源: "推荐资源：\n- 官方文档链接\n- 开源项目参考仓库\n- 技术博客与视频教程\n- 内部知识库文章\n- 在线实验环境",
  生成配置任务测评形式: "测评形式：\n- 代码评审（占比30%）\n- 自动化测试通过率（占比40%）\n- 功能演示与答辩（占比30%）\n评分维度：功能完整性、代码质量、文档规范、演示表达。",
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function StarRating({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < level
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  )
}

function ProgressBar({ loading }: { loading: boolean }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full bg-purple-600 transition-all",
          loading ? "w-full duration-[1500ms] ease-out" : "w-0 duration-0"
        )}
      />
    </div>
  )
}

function ProgressBarShort({ loading }: { loading: boolean }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full bg-purple-600 transition-all",
          loading ? "w-full duration-[800ms] ease-out" : "w-0 duration-0"
        )}
      />
    </div>
  )
}

// ------------------------------------------------------------------
// Industry / Profession Multi-select Selector
// ------------------------------------------------------------------

function IndustryProfessionSelector({
  options,
  selectedIds,
  onChange,
  placeholder,
  disabled,
}: {
  options: { id: string; name: string }[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  placeholder: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleOption = (id: string) => {
    if (disabled) return
    onChange(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id])
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex h-auto min-h-[36px] w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
      >
        {selectedIds.length === 0 ? (
          <span className="text-muted-foreground">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedIds.map(id => {
              const opt = options.find(o => o.id === id)
              if (!opt) return null
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                >
                  {opt.name}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        toggleOption(id)
                      }}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              )
            })}
          </div>
        )}
        <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <div className="p-2 max-h-[240px] overflow-y-auto">
            {options.map(opt => (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer hover:bg-gray-50",
                  selectedIds.includes(opt.id) && "bg-primary/5 text-primary"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                  selectedIds.includes(opt.id) ? "bg-primary border-primary" : "border-gray-300"
                )}>
                  {selectedIds.includes(opt.id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span>{opt.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ------------------------------------------------------------------
// Main Page
// ------------------------------------------------------------------

export default function AiFirstScenarioEditPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params.id as string

  const [step, setStep] = useState(0)

  // Step 1 form
  const [position, setPosition] = useState("")
  const [requirement, setRequirement] = useState("")
  const [industries, setIndustries] = useState<string[]>([])
  const [majors, setMajors] = useState<string[]>([])

  // Step 2
  const [generatingScenarios, setGeneratingScenarios] = useState(false)
  const [scenarioList, setScenarioList] = useState<typeof MOCK_SCENARIOS>([])
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([])

  // Step 3
  const [selectedScenarios, setSelectedScenarios] = useState<typeof MOCK_SCENARIOS>([])
  const [activeTab, setActiveTab] = useState("")
  const [tasksMap, setTasksMap] = useState<Record<string, typeof MOCK_TASKS>>({})
  const [generatingTasksMap, setGeneratingTasksMap] = useState<Record<string, boolean>>({})

  // Rich scenario form state per scenario
  interface ScenarioForm {
    id: string
    name: string
    code: string
    positionId: string
    batchId: string
    industryIds: string[]
    professionIds: string[]
    difficulty: number
    background: string
    coverImage: string
    coBuilderIds: string[]
    creatorName: string
    version: string
  }
  const [scenarioForms, setScenarioForms] = useState<Record<string, ScenarioForm>>({})

  // Generated content state per scenario per task per button
  const [generatedState, setGeneratedState] = useState<
    Record<string, Record<string, Record<string, boolean>>>
  >({})

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")
  const [dialogScenarioId, setDialogScenarioId] = useState("")
  const [dialogTaskId, setDialogTaskId] = useState("")
  const [dialogButtonKey, setDialogButtonKey] = useState("")
  const [dialogAiGenerating, setDialogAiGenerating] = useState(false)

  // AI assisted editing
  const [isAiCreateDialogOpen, setIsAiCreateDialogOpen] = useState(false)
  const [aiTargetPosition, setAiTargetPosition] = useState("")
  const [aiSceneDescription, setAiSceneDescription] = useState("")
  const [aiProgress, setAiProgress] = useState(0)
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [aiGeneratedPreview, setAiGeneratedPreview] = useState<{
    name: string
    code: string
    positionId: string
    industryIds: string[]
    professionIds: string[]
    difficulty: number
    background: string
    coverImage: string
  } | null>(null)
  const [isAiGeneratedPreviewOpen, setIsAiGeneratedPreviewOpen] = useState(false)
  const [aiRegenerateCount, setAiRegenerateCount] = useState(0)
  const [activeAiScenarioId, setActiveAiScenarioId] = useState("")

  // Task chain regenerate dialog
  const [taskRegenDialogOpen, setTaskRegenDialogOpen] = useState(false)
  const [taskRegenScenarioId, setTaskRegenScenarioId] = useState("")
  const [taskRegenFeedback, setTaskRegenFeedback] = useState("")

  // Submitted scenarios (locked for editing)
  const [submittedScenarios, setSubmittedScenarios] = useState<Set<string>>(new Set())

  // Co-builder dialog
  const [isCoBuilderDialogOpen, setIsCoBuilderDialogOpen] = useState(false)
  const [activeCoBuilderScenarioId, setActiveCoBuilderScenarioId] = useState("")
  const [expandedDepts, setExpandedDepts] = useState<string[]>(Array.from(new Set(allTeachers.map(t => t.department))))
  const [coBuilderSearch, setCoBuilderSearch] = useState("")

  // Department tree helper
  const departments = useMemo(() => Array.from(new Set(allTeachers.map(t => t.department))), [])
  const departmentTree = useMemo(() =>
    departments.map(dept => ({
      name: dept,
      users: allTeachers.filter(t => t.department === dept),
    })),
    [departments]
  )

  const filteredTeachers = useMemo(() => {
    if (!coBuilderSearch.trim()) return allTeachers
    const q = coBuilderSearch.toLowerCase()
    return allTeachers.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q)
    )
  }, [coBuilderSearch])

  const steps = [
    { title: "描述需求", desc: "填写关键词让 AI 理解您的场景需求" },
    { title: "AI 生成场景清单", desc: "AI 智能推荐多个候选场景" },
    { title: "确认并完善场景", desc: "审核场景信息并生成任务链" },
  ]

  const toggleIndustry = (val: string) => {
    setIndustries((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
  }

  const toggleMajor = (val: string) => {
    setMajors((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
  }

  const handleGenerateScenarios = () => {
    setGeneratingScenarios(true)
    setTimeout(() => {
      // Simple filtering to make it feel relevant
      let filtered = MOCK_SCENARIOS.filter((s) => {
        const matchIndustry =
          industries.length === 0 ||
          s.industries.some((ind) => industries.includes(ind))
        const matchMajor =
          majors.length === 0 || s.majors.some((m) => majors.includes(m))
        return matchIndustry || matchMajor
      })
      if (filtered.length < 3) filtered = MOCK_SCENARIOS.slice(0, 5)
      setScenarioList(filtered)
      setSelectedScenarioIds([])
      setGeneratingScenarios(false)
      setStep(1)
    }, 1500)
  }

  const toggleScenarioSelection = (id: string) => {
    setSelectedScenarioIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const handleConfirmScenarios = () => {
    const selected = scenarioList.filter((s) =>
      selectedScenarioIds.includes(s.id)
    )
    setSelectedScenarios(selected)
    const forms: Record<string, ScenarioForm> = {}
    selected.forEach((s, idx) => {
      forms[s.id] = {
        id: s.id,
        name: s.name,
        code: `SC-${new Date().getFullYear()}-${String(1001 + idx).slice(1)}`,
        positionId: "",
        batchId: "",
        industryIds: s.industries,
        professionIds: s.majors,
        difficulty: s.difficulty,
        background: s.intro,
        coverImage: "",
        coBuilderIds: [],
        creatorName: "当前用户",
        version: "v1.0",
      }
    })
    setScenarioForms(forms)
    if (selected.length > 0) setActiveTab(selected[0].id)
    setStep(2)
  }

  const updateScenarioField = (id: string, field: keyof ScenarioForm, value: any) => {
    setScenarioForms(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }

  const allPositions = useMemo(() => {
    return professions.flatMap(prof =>
      prof.positions.map(pos => ({ ...pos, professionName: prof.name, professionId: prof.id }))
    )
  }, [])

  const handleStartAiGenerate = (regenCount?: number) => {
    if (!aiTargetPosition) return
    setIsAiGenerating(true)
    setAiProgress(0)

    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setAiProgress(100)

      const dataSetIndex = (regenCount ?? aiRegenerateCount) % 2

      const suffixesSetA = ["智慧电商平台", "企业级管理系统", "社交应用平台", "在线教育平台", "智能物流系统", "医疗健康平台", "金融科技应用", "智慧城市项目"]
      const suffixesSetB = ["供应链协同平台", "智能客服系统", "社区团购平台", "远程办公系统", "数字孪生系统", "跨境电商系统", "自动驾驶仿真", "物联网监控平台"]
      const suffixes = dataSetIndex === 0 ? suffixesSetA : suffixesSetB
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)]
      const newName = `${aiTargetPosition}实战场景 — ${randomSuffix}`
      const newCode = `SC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`

      const shuffledIndustries = [...INDUSTRY_OPTIONS].sort(() => 0.5 - Math.random())
      const selectedIndustryIds = shuffledIndustries.slice(0, Math.floor(Math.random() * 2) + 1)

      const shuffledProfessions = [...MAJOR_OPTIONS].sort(() => 0.5 - Math.random())
      const selectedProfessionIds = shuffledProfessions.slice(0, Math.floor(Math.random() * 2) + 1)

      const newDifficulty = Math.floor(Math.random() * 5) + 1

      const mockIntroSetA = `本场景围绕${aiTargetPosition}核心能力培养，通过真实企业级项目实战，帮助学员掌握从需求分析、架构设计到开发落地的完整流程。场景以${randomSuffix}为项目载体，涵盖前后端协同开发、数据库设计、接口联调、性能优化等关键环节，培养学员的工程化思维和团队协作能力。学员将在模拟真实工作环境中，经历完整的项目生命周期，积累可复用的工程实践经验。`
      const mockIntroSetB = `本场景聚焦${aiTargetPosition}岗位实战技能提升，以${randomSuffix}真实业务场景为切入点，构建从需求梳理、技术方案设计、编码实现到测试部署的完整项目闭环。学员将深入理解业务架构与系统设计的映射关系，掌握高并发处理、数据一致性保障、安全防护等进阶技术，同时锻炼跨职能沟通与敏捷迭代能力，为进入真实工作环境做好充分准备。`
      const mockIntro = dataSetIndex === 0 ? mockIntroSetA : mockIntroSetB

      const covers = ["/placeholder.jpg", "/placeholder-logo.png", "/placeholder-user.jpg"]
      const newCover = covers[Math.floor(Math.random() * covers.length)]

      const matchedPosition = allPositions.find(p => p.name === aiTargetPosition)

      setAiGeneratedPreview({
        name: newName,
        code: newCode,
        positionId: matchedPosition?.id || "",
        industryIds: selectedIndustryIds,
        professionIds: selectedProfessionIds,
        difficulty: newDifficulty,
        background: mockIntro,
        coverImage: newCover,
      })

      setIsAiGenerating(false)
      setAiProgress(0)
      setAiSceneDescription("")
      setAiTargetPosition("")
      setIsAiCreateDialogOpen(false)
      setIsAiGeneratedPreviewOpen(true)
    }, 1500)
  }

  const handleGenerateTasks = (scenarioId: string) => {
    setGeneratingTasksMap((prev) => ({ ...prev, [scenarioId]: true }))
    setTimeout(() => {
      setTasksMap((prev) => ({
        ...prev,
        [scenarioId]: MOCK_TASKS.slice(
          0,
          3 + Math.floor(Math.random() * 4)
        ),
      }))
      setGeneratingTasksMap((prev) => ({ ...prev, [scenarioId]: false }))
    }, 1500)
  }

  const handleOpenTaskRegenDialog = (scenarioId: string) => {
    setTaskRegenScenarioId(scenarioId)
    setTaskRegenFeedback("")
    setTaskRegenDialogOpen(true)
  }

  const handleConfirmTaskRegen = () => {
    if (!taskRegenScenarioId) return
    setTaskRegenDialogOpen(false)
    handleGenerateTasks(taskRegenScenarioId)
    setTaskRegenScenarioId("")
    setTaskRegenFeedback("")
  }

  const handleSubmitApproval = (scenarioId: string) => {
    setSubmittedScenarios(prev => new Set(prev).add(scenarioId))
  }

  const isScenarioSubmitted = (scenarioId: string) => submittedScenarios.has(scenarioId)

  const toggleCoBuilder = (userId: string) => {
    if (!activeCoBuilderScenarioId) return
    const currentIds = scenarioForms[activeCoBuilderScenarioId]?.coBuilderIds || []
    updateScenarioField(
      activeCoBuilderScenarioId,
      "coBuilderIds",
      currentIds.includes(userId)
        ? currentIds.filter(id => id !== userId)
        : [...currentIds, userId]
    )
  }

  const toggleDept = (deptName: string) => {
    setExpandedDepts(prev =>
      prev.includes(deptName)
        ? prev.filter(d => d !== deptName)
        : [...prev, deptName]
    )
  }

  const handleOpenCoBuilderDialog = (scenarioId: string) => {
    setActiveCoBuilderScenarioId(scenarioId)
    setCoBuilderSearch("")
    setIsCoBuilderDialogOpen(true)
  }

  const handleGenerateButton = (
    scenarioId: string,
    taskId: string,
    buttonKey: string
  ) => {
    setGeneratedState((prev) => {
      const s = prev[scenarioId] || {}
      const t = s[taskId] || {}
      return {
        ...prev,
        [scenarioId]: {
          ...s,
          [taskId]: {
            ...t,
            [buttonKey]: false, // will be set to true after delay
          },
        },
      }
    })
    setTimeout(() => {
      setGeneratedState((prev) => {
        const s = prev[scenarioId] || {}
        const t = s[taskId] || {}
        return {
          ...prev,
          [scenarioId]: {
            ...s,
            [taskId]: {
              ...t,
              [buttonKey]: true,
            },
          },
        }
      })
    }, 800)
  }

  const openDetailDialog = (
    scenarioId: string,
    taskId: string,
    buttonKey: string
  ) => {
    setDialogScenarioId(scenarioId)
    setDialogTaskId(taskId)
    setDialogButtonKey(buttonKey)
    setDialogTitle(buttonKey)
    setDialogContent(GENERATED_CONTENT_MOCK[buttonKey] || "")
    setDialogOpen(true)
  }

  const saveDialogContent = () => {
    // In a real app this would persist; here we just close
    setDialogOpen(false)
  }

  const handleDialogAiGenerate = () => {
    setDialogAiGenerating(true)
    setTimeout(() => {
      setDialogAiGenerating(false)
    }, 1200)
  }

  const scenarioDescriptionMap = useCallback(() => {
    const map: Record<string, string> = {}
    selectedScenarios.forEach((s) => {
      map[s.id] = s.intro
    })
    return map
  }, [selectedScenarios])()

  const [scenarioDescriptions, setScenarioDescriptions] =
    useState<Record<string, string>>(scenarioDescriptionMap)

  const updateScenarioDesc = (id: string, val: string) => {
    setScenarioDescriptions((prev) => ({ ...prev, [id]: val }))
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">AI 场景创建向导</h1>
              <p className="text-xs text-gray-500">
                让 AI 帮你从零构建实践场景
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/ai-first")}>
            <X className="h-4 w-4 mr-1" />
            退出向导
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="max-w-full mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-3 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      i <= step ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1",
                      i < step ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full mx-auto px-6 py-8">
        {/* Step 1 */}
        {step === 0 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  描述需求
                </h2>
                <p className="text-sm text-gray-500">
                  填写以下信息，AI 将为您智能生成候选场景
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>目标岗位</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="请选择目标岗位" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITION_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>场景需求</Label>
                  <Textarea
                    placeholder="请描述您想要的实践场景，例如：一个中型电商企业的全栈开发实战"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>面向行业</Label>
                  <div className="flex flex-wrap gap-3">
                    {INDUSTRY_OPTIONS.map((ind) => (
                      <label
                        key={ind}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={industries.includes(ind)}
                          onCheckedChange={() => toggleIndustry(ind)}
                        />
                        <span>{ind}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>适用专业</Label>
                  <div className="flex flex-wrap gap-3">
                    {MAJOR_OPTIONS.map((m) => (
                      <label
                        key={m}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={majors.includes(m)}
                          onCheckedChange={() => toggleMajor(m)}
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 h-12 text-base"
                onClick={handleGenerateScenarios}
                disabled={!position || !requirement || generatingScenarios}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {generatingScenarios ? "AI 生成中..." : "AI 智能生成"}
              </Button>

              {generatingScenarios && <ProgressBar loading={generatingScenarios} />}
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  AI 生成场景清单
                </h2>
                <p className="text-sm text-gray-500">
                  请勾选您需要的场景，AI 将为您完善场景基本信息
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>场景名称</TableHead>
                      <TableHead>场景难度</TableHead>
                      <TableHead>场景介绍</TableHead>
                      <TableHead>面向行业</TableHead>
                      <TableHead>适用专业</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarioList.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedScenarioIds.includes(s.id)}
                            onCheckedChange={() =>
                              toggleScenarioSelection(s.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {s.name}
                        </TableCell>
                        <TableCell>
                          <StarRating level={s.difficulty} />
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-gray-600">
                          {s.intro}
                        </TableCell>
                        <TableCell className="text-sm">
                          {s.industries.join(", ")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {s.majors.join(", ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(0)}
                >
                  返回修改需求
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 h-12 text-base"
                  disabled={selectedScenarioIds.length === 0}
                  onClick={handleConfirmScenarios}
                >
                  AI 完善选中场景基本信息
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {step === 2 && selectedScenarios.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                {selectedScenarios.map((s) => (
                  <TabsTrigger key={s.id} value={s.id}>
                    {s.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button
                size="sm"
                onClick={() => router.push("/ai-first")}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                完成批量场景创建配置
              </Button>
            </div>

            {selectedScenarios.map((s) => (
              <TabsContent key={s.id} value={s.id}>
                <div className="space-y-6">
                  {/* 场景基本信息 */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Left: Main form */}
                    <div className="col-span-2 space-y-6">
                      <Card>
                        <CardContent className="pt-6 space-y-5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">场景基本信息</h3>
                            <Button
                              size="sm"
                              onClick={() => {
                                setActiveAiScenarioId(s.id)
                                setIsAiCreateDialogOpen(true)
                              }}
                              variant="outline"
                              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 gap-1 shrink-0"
                              disabled={isScenarioSubmitted(s.id)}
                            >
                              <Wand2 className="h-4 w-4" />
                              AI 辅助编辑
                            </Button>
                          </div>

                          {/* Position and Batch */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>目标岗位</Label>
                              <Select
                                value={scenarioForms[s.id]?.positionId || ""}
                                onValueChange={(v) => updateScenarioField(s.id, "positionId", v)}
                                disabled={isScenarioSubmitted(s.id)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="请选择岗位" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <div className="grid gap-2">
                              <Label>所属批次</Label>
                              <Select
                                value={scenarioForms[s.id]?.batchId || ""}
                                onValueChange={(v) => updateScenarioField(s.id, "batchId", v)}
                                disabled={isScenarioSubmitted(s.id)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="请选择批次" />
                                </SelectTrigger>
                                <SelectContent>
                                  {batches.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Name */}
                          <div className="grid gap-2">
                            <Label>场景名称 <span className="text-red-500">*</span></Label>
                            <Input
                              value={scenarioForms[s.id]?.name || ""}
                              onChange={(e) => updateScenarioField(s.id, "name", e.target.value)}
                              placeholder="请输入场景名称"
                              disabled={isScenarioSubmitted(s.id)}
                            />
                          </div>

                          {/* Code */}
                          <div className="grid gap-2">
                            <Label>场景编码</Label>
                            <Input value={scenarioForms[s.id]?.code || ""} disabled className="bg-gray-50" />
                            <p className="text-xs text-gray-400">系统自动生成，不可修改</p>
                          </div>

                          {/* Industry and Profession - multi-select with tags */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>面向行业</Label>
                              <IndustryProfessionSelector
                                options={INDUSTRY_OPTIONS.map(i => ({ id: i, name: i }))}
                                selectedIds={scenarioForms[s.id]?.industryIds || []}
                                onChange={(ids) => updateScenarioField(s.id, "industryIds", ids)}
                                placeholder="选择行业"
                                disabled={isScenarioSubmitted(s.id)}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>适用专业</Label>
                              <IndustryProfessionSelector
                                options={MAJOR_OPTIONS.map(m => ({ id: m, name: m }))}
                                selectedIds={scenarioForms[s.id]?.professionIds || []}
                                onChange={(ids) => updateScenarioField(s.id, "professionIds", ids)}
                                placeholder="选择专业"
                                disabled={isScenarioSubmitted(s.id)}
                              />
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
                                  onClick={() => updateScenarioField(s.id, "difficulty", level)}
                                  className="p-1 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                  disabled={isScenarioSubmitted(s.id)}
                                >
                                  <Star
                                    className={cn(
                                      "h-6 w-6 transition-colors",
                                      level <= (scenarioForms[s.id]?.difficulty || 3)
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-gray-200 text-gray-200 hover:fill-amber-200 hover:text-amber-200"
                                    )}
                                  />
                                </button>
                              ))}
                              <span className="ml-2 text-sm text-gray-500">
                                {(scenarioForms[s.id]?.difficulty || 3) === 1 && "入门"}
                                {(scenarioForms[s.id]?.difficulty || 3) === 2 && "基础"}
                                {(scenarioForms[s.id]?.difficulty || 3) === 3 && "中级"}
                                {(scenarioForms[s.id]?.difficulty || 3) === 4 && "高级"}
                                {(scenarioForms[s.id]?.difficulty || 3) === 5 && "专家"}
                              </span>
                            </div>
                          </div>

                          {/* Background with rich-text toolbar */}
                          <div className="grid gap-2">
                            <Label>场景介绍</Label>
                            <div className="border rounded-lg">
                              <div className="bg-gray-50 border-b px-3 py-2 flex gap-1 items-center">
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold" disabled={isScenarioSubmitted(s.id)}>B</Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs italic" disabled={isScenarioSubmitted(s.id)}>I</Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs underline" disabled={isScenarioSubmitted(s.id)}>U</Button>
                                <div className="w-px bg-gray-200 mx-1 h-5" />
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" disabled={isScenarioSubmitted(s.id)}>
                                  <List className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" disabled={isScenarioSubmitted(s.id)}>
                                  <ListOrdered className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                              <Textarea
                                value={scenarioForms[s.id]?.background || ""}
                                onChange={(e) => updateScenarioField(s.id, "background", e.target.value)}
                                placeholder="描述该场景的背景、意义和学习目标..."
                                className="border-0 min-h-[200px] focus-visible:ring-0 rounded-t-none"
                                disabled={isScenarioSubmitted(s.id)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right: Cover and co-builders */}
                    <div className="space-y-6">
                      {/* Cover image */}
                      <Card>
                        <CardContent className="pt-6">
                          <Label className="mb-3 block">场景封面</Label>
                          <div className={cn(
                            "aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden",
                            isScenarioSubmitted(s.id) ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50 transition-colors"
                          )}>
                            {scenarioForms[s.id]?.coverImage ? (
                              <img src={scenarioForms[s.id].coverImage} alt="场景封面" className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">点击上传封面图片</p>
                                <p className="text-xs text-gray-400 mt-1">建议尺寸 320x200</p>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Creator and co-builders */}
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div>
                            <Label className="text-gray-500 text-xs">创建人</Label>
                            <p className="font-medium text-gray-800 mt-1">{scenarioForms[s.id]?.creatorName || "当前用户"}</p>
                          </div>

                          <div>
                            <Label className="mb-2 block">共建人/共建部门</Label>
                            <div
                              className={cn(
                                "border rounded-lg p-3 transition-colors",
                                isScenarioSubmitted(s.id) ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
                              )}
                              onClick={() => {
                                if (!isScenarioSubmitted(s.id)) {
                                  handleOpenCoBuilderDialog(s.id)
                                }
                              }}
                            >
                              {(scenarioForms[s.id]?.coBuilderIds || []).length === 0 ? (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <UserPlus className="h-4 w-4" />
                                  <span className="text-sm">点击选择共建人</span>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {(scenarioForms[s.id]?.coBuilderIds || []).map((userId) => {
                                    const user = allTeachers.find(t => t.id === userId)
                                    if (!user) return null
                                    return (
                                      <div
                                        key={user.id}
                                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                                      >
                                        <span>{user.name}</span>
                                        {!isScenarioSubmitted(s.id) && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setActiveCoBuilderScenarioId(s.id)
                                              toggleCoBuilder(user.id)
                                            }}
                                            className="hover:bg-primary/20 rounded-full p-0.5"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <Label className="text-gray-500 text-xs">当前版本号</Label>
                            <p className="font-medium text-gray-800 mt-1">{scenarioForms[s.id]?.version || "v1.0"}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  {/* 生成任务链 */}
                  {!tasksMap[s.id] && (
                    <div className="flex flex-col items-center gap-4 py-6">
                      <Button
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 h-11 px-8"
                        onClick={() => handleGenerateTasks(s.id)}
                        disabled={isScenarioSubmitted(s.id) || generatingTasksMap[s.id]}
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        {generatingTasksMap[s.id]
                          ? "生成中..."
                          : "生成任务链"}
                      </Button>
                      {generatingTasksMap[s.id] && (
                        <div className="w-64">
                          <ProgressBar loading={generatingTasksMap[s.id]} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 任务链表格 */}
                  {tasksMap[s.id] && (
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            任务链
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenTaskRegenDialog(s.id)}
                            disabled={isScenarioSubmitted(s.id) || generatingTasksMap[s.id]}
                          >
                            <Sparkles className="h-4 w-4 mr-1" />
                            重新生成
                          </Button>
                        </div>

                        {generatingTasksMap[s.id] && (
                          <div className="w-full">
                            <ProgressBar loading={generatingTasksMap[s.id]} />
                          </div>
                        )}

                        <div className="border rounded-lg overflow-hidden">
                          <TaskTable
                            scenarioId={s.id}
                            tasks={tasksMap[s.id]}
                            generatedState={generatedState[s.id] || {}}
                            onGenerate={handleGenerateButton}
                            onOpenDetail={openDetailDialog}
                            disabled={isScenarioSubmitted(s.id)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submit approval */}
                  {tasksMap[s.id] && (
                    <div className="flex items-center justify-end">
                      <Button
                        disabled={isScenarioSubmitted(s.id)}
                        onClick={() => handleSubmitApproval(s.id)}
                      >
                        {isScenarioSubmitted(s.id) ? "已提交审批" : "提交审批"}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={cn(
          "flex flex-col overflow-hidden",
          dialogButtonKey === "生成配置任务说明" ? "sm:max-w-[900px] max-h-[90vh]" :
          dialogButtonKey === "生成配置任务测评形式" ? "sm:max-w-[720px] max-h-[85vh]" :
          "sm:max-w-[550px] max-h-[85vh]"
        )}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded">
                {dialogButtonKey === "生成配置任务说明" && <ListOrdered className="h-4 w-4 text-primary" />}
                {dialogButtonKey === "生成关联知识点" && <BookOpen className="h-4 w-4 text-primary" />}
                {dialogButtonKey === "生成关联能力点" && <Zap className="h-4 w-4 text-primary" />}
                {dialogButtonKey === "生成关联任务资源" && <FolderOpen className="h-4 w-4 text-primary" />}
                {dialogButtonKey === "生成配置任务测评形式" && <ClipboardCheck className="h-4 w-4 text-primary" />}
              </div>
              {dialogTitle.replace("生成", "").replace("配置", "")}
            </DialogTitle>
            <DialogDescription>
              任务：{tasksMap[dialogScenarioId]?.find(t => t.id === dialogTaskId)?.name || ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 py-4 overflow-y-auto">
            {dialogButtonKey === "生成配置任务说明" && (
              <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">AI 智能生成内容</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDialogAiGenerate}
                disabled={dialogAiGenerating}
                className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
              >
                {dialogAiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {dialogAiGenerating ? "生成中..." : "AI 生成"}
              </Button>
            </div>
                <Tabs defaultValue="rich_text">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="rich_text">富文本编辑</TabsTrigger>
                    <TabsTrigger value="pdf">上传任务说明书</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex-1 flex flex-col min-h-0">
                  <p className="text-xs text-gray-500 mb-2">可编写详细的操作手册，支持图文混排</p>
                  <div className="border rounded-lg overflow-hidden flex-1 flex flex-col min-h-[400px]">
                    <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-primary hover:bg-primary/5">B</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-primary hover:bg-primary/5 italic">I</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-primary hover:bg-primary/5 underline">U</Button>
                      <div className="w-px bg-gray-200 mx-1 h-5" />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-primary hover:bg-primary/5"><List className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-primary hover:bg-primary/5"><ListOrdered className="h-4 w-4" /></Button>
                    </div>
                    <div className="p-4 flex-1 bg-white">
                      <Textarea
                        value={dialogContent}
                        onChange={(e) => setDialogContent(e.target.value)}
                        className="border-0 min-h-full w-full focus-visible:ring-0 resize-none text-sm leading-relaxed"
                      />
                    </div>
                    <div className="bg-gray-50 border-t px-3 py-1.5 flex items-center justify-between text-xs text-gray-400">
                      <span>纯文本模式</span>
                      <span>{dialogContent.length} 字符</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {dialogButtonKey === "生成关联知识点" && (
              <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">AI 智能生成内容</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDialogAiGenerate}
                disabled={dialogAiGenerating}
                className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
              >
                {dialogAiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {dialogAiGenerating ? "生成中..." : "AI 生成"}
              </Button>
            </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="搜索知识点名称、描述或编码..." className="pl-9" />
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>知识点名称</TableHead>
                        <TableHead>编码</TableHead>
                        <TableHead>描述</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: "kp-1", name: "RESTful API 设计规范", code: "KP-001", description: "掌握 RESTful 架构风格的核心原则与设计方法" },
                        { id: "kp-2", name: "OAuth2.0 认证流程", code: "KP-002", description: "理解 OAuth2.0 四种授权模式及安全实践" },
                        { id: "kp-3", name: "数据库事务与隔离级别", code: "KP-003", description: "掌握 ACID 特性及四种隔离级别的应用场景" },
                        { id: "kp-4", name: "前端状态管理", code: "KP-004", description: "熟练使用 Redux/Vuex 进行复杂状态管理" },
                        { id: "kp-5", name: "Docker 容器化基础", code: "KP-005", description: "掌握 Docker 镜像构建、容器管理与编排基础" },
                      ].map(kp => (
                        <TableRow key={kp.id}>
                          <TableCell><Checkbox checked /></TableCell>
                          <TableCell className="font-medium text-sm">{kp.name}</TableCell>
                          <TableCell className="text-xs font-mono text-gray-500">{kp.code}</TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-xs truncate">{kp.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">已选知识点</Label>
                  <div className="flex flex-wrap gap-2">
                    {["RESTful API 设计规范", "OAuth2.0 认证流程", "数据库事务与隔离级别", "前端状态管理", "Docker 容器化基础"].map(name => (
                      <Badge key={name} variant="outline" className="text-xs">{name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {dialogButtonKey === "生成关联能力点" && (
              <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">AI 智能生成内容</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDialogAiGenerate}
                disabled={dialogAiGenerating}
                className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
              >
                {dialogAiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {dialogAiGenerating ? "生成中..." : "AI 生成"}
              </Button>
            </div>
                {[
                  { domain: "系统设计", items: [
                    { name: "系统分析与设计能力", code: "AB-001", level: "L3", desc: "能够对中等复杂度的业务系统进行需求分析和架构设计" },
                    { name: "微服务架构设计能力", code: "AB-002", level: "L4", desc: "掌握微服务拆分原则，能设计高可用的分布式系统" },
                  ]},
                  { domain: "编码实现", items: [
                    { name: "编码实现能力", code: "AB-003", level: "L4", desc: "能够高质量地完成核心业务模块的编码实现" },
                    { name: "问题排查与调试能力", code: "AB-004", level: "L3", desc: "能够定位并解决常见的系统问题和性能瓶颈" },
                  ]},
                  { domain: "团队协作", items: [
                    { name: "团队协作与沟通能力", code: "AB-005", level: "L2", desc: "能够在团队中有效沟通，推动协作任务顺利进行" },
                  ]},
                ].map(group => (
                  <div key={group.domain}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                      {group.domain}
                    </h4>
                    <div className="space-y-2 ml-6">
                      {group.items.map(item => (
                        <div key={item.code} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50/50">
                          <Checkbox checked className="mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium">{item.name}</span>
                              <Badge variant="outline" className="font-mono text-[10px] h-5">{item.code}</Badge>
                              <Badge variant="secondary" className="text-[10px] h-5">掌握度 {item.level}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {dialogButtonKey === "生成关联任务资源" && (
              <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">AI 智能生成内容</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDialogAiGenerate}
                disabled={dialogAiGenerating}
                className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
              >
                {dialogAiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {dialogAiGenerating ? "生成中..." : "AI 生成"}
              </Button>
            </div>
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" className="text-xs h-8">全部</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8">文档</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8">视频</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8">链接</Button>
                  <div className="flex-1" />
                  <div className="relative w-48">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input placeholder="搜索资源..." className="h-8 pl-7 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Spring Boot 官方文档", type: "文档", icon: "📄" },
                    { name: "RESTful API 设计最佳实践", type: "文档", icon: "📄" },
                    { name: "OAuth2.0 流程讲解视频", type: "视频", icon: "🎬" },
                    { name: "Docker 入门教程", type: "视频", icon: "🎬" },
                    { name: "GitHub 开源参考仓库", type: "链接", icon: "🔗" },
                    { name: "内部知识库文章", type: "文档", icon: "📄" },
                  ].map((res, i) => (
                    <div key={i} className="border rounded-lg p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">{res.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{res.name}</p>
                        <Badge variant="secondary" className="text-[10px] mt-1">{res.type}</Badge>
                      </div>
                      <Checkbox checked />
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <Label className="text-xs text-gray-500 mb-2 block">已选资源</Label>
                  <div className="space-y-1">
                    {["Spring Boot 官方文档", "RESTful API 设计最佳实践", "OAuth2.0 流程讲解视频", "Docker 入门教程", "GitHub 开源参考仓库", "内部知识库文章"].map(name => (
                      <div key={name} className="flex items-center justify-between px-2 py-1.5 rounded text-sm bg-primary/5 text-primary">
                        <span>{name}</span>
                        <button className="hover:bg-primary/10 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {dialogButtonKey === "生成配置任务测评形式" && (
              <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">AI 智能生成内容</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDialogAiGenerate}
                disabled={dialogAiGenerating}
                className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
              >
                {dialogAiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {dialogAiGenerating ? "生成中..." : "AI 生成"}
              </Button>
            </div>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" className="text-xs h-8">全部</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8">知识评价</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8">过程评价</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-8">成果评价</Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "题库测评", desc: "从题库中随机抽题进行在线测评", icon: "📝", selected: true },
                    { name: "试卷测评", desc: "使用预设试卷进行标准化测评", icon: "📑", selected: true },
                    { name: "随堂测试", desc: "快速发布的小测验", icon: "⏱️", selected: false },
                    { name: "现场问答", desc: "教师现场提问，学生口头回答", icon: "🎤", selected: true },
                    { name: "现场评审", desc: "多评审人对学生表现打分", icon: "👥", selected: false },
                    { name: "成果评价", desc: "对学生提交的成果物进行评价", icon: "📤", selected: false },
                  ].map((method, i) => (
                    <div key={i} className={cn(
                      "border rounded-lg p-4 relative transition-colors",
                      method.selected ? "border-primary/30 bg-primary/5" : "hover:bg-gray-50"
                    )}>
                      {method.selected && <div className="absolute top-2 right-2"><Check className="h-4 w-4 text-primary" /></div>}
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <p className="text-sm font-medium">{method.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="border rounded-lg p-4 bg-gray-50/50">
                  <h4 className="text-sm font-medium mb-3">测评配置概览</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">代码评审</span><span>占比 30%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">自动化测试通过率</span><span>占比 40%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">功能演示与答辩</span><span>占比 30%</span></div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">评分维度：功能完整性、代码质量、文档规范、演示表达。</p>
                  </div>
                </div>
              </div>
            )}
            {!BUTTON_KEYS.includes(dialogButtonKey) && (
              <Textarea
                value={dialogContent}
                onChange={(e) => setDialogContent(e.target.value)}
                rows={10}
                className="text-sm"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Assisted Creation Dialog */}
      <Dialog open={isAiCreateDialogOpen} onOpenChange={setIsAiCreateDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>AI 辅助场景创建</DialogTitle>
            <DialogDescription>选择目标岗位并描述您想要的场景，AI 将为您生成基础信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ai-position">目标岗位</Label>
              <Select value={aiTargetPosition} onValueChange={setAiTargetPosition}>
                <SelectTrigger id="ai-position">
                  <SelectValue placeholder="请选择目标岗位" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_OPTIONS.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ai-description">场景描述</Label>
              <Textarea
                id="ai-description"
                value={aiSceneDescription}
                onChange={(e) => setAiSceneDescription(e.target.value)}
                placeholder="请用一句话描述您想要的场景，例如：一个电商平台的完整开发实战场景"
                rows={3}
              />
            </div>
            {isAiGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>AI 生成中...</span>
                  <span>{aiProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-200"
                    style={{ width: `${aiProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiCreateDialogOpen(false)} disabled={isAiGenerating}>
              取消
            </Button>
            <Button
              onClick={() => handleStartAiGenerate()}
              disabled={!aiTargetPosition || isAiGenerating}
              variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 gap-1"
            >
              {isAiGenerating ? (
                <>生成中...</>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  开始AI生成
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generated Preview Dialog */}
      <Dialog open={isAiGeneratedPreviewOpen} onOpenChange={setIsAiGeneratedPreviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 生成结果预览
            </DialogTitle>
            <DialogDescription>
              AI 已生成以下场景基础信息，确认后将填充到当前表单，取消则保留原内容。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {aiGeneratedPreview && (
              <>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src={aiGeneratedPreview.coverImage} alt="场景封面" className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">场景名称</p>
                    <p className="font-medium text-sm">{aiGeneratedPreview.name}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">场景编码</p>
                    <p className="font-medium text-sm">{aiGeneratedPreview.code}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">目标岗位</p>
                    <p className="font-medium text-sm">{allPositions.find(p => p.id === aiGeneratedPreview.positionId)?.name || aiTargetPosition || "未选择"}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">面向行业</p>
                    <p className="font-medium text-sm">
                      {aiGeneratedPreview.industryIds.join("、") || "未选择"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">适用专业</p>
                    <p className="font-medium text-sm">
                      {aiGeneratedPreview.professionIds.join("、") || "未选择"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 mb-1">难度等级</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-4 w-4", i < aiGeneratedPreview.difficulty ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">场景介绍</p>
                  <p className="text-sm whitespace-pre-line">{aiGeneratedPreview.background}</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAiGeneratedPreviewOpen(false)}>
              取消
            </Button>
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => {
                const next = aiRegenerateCount + 1
                setAiRegenerateCount(next)
                handleStartAiGenerate(next)
              }}
            >
              <RefreshCw className="h-4 w-4" />
              重新生成
            </Button>
            <Button
              variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 gap-1"
              onClick={() => {
                if (!aiGeneratedPreview || !activeAiScenarioId) return
                updateScenarioField(activeAiScenarioId, "name", aiGeneratedPreview.name)
                updateScenarioField(activeAiScenarioId, "code", aiGeneratedPreview.code)
                if (aiGeneratedPreview.positionId) {
                  updateScenarioField(activeAiScenarioId, "positionId", aiGeneratedPreview.positionId)
                }
                updateScenarioField(activeAiScenarioId, "industryIds", aiGeneratedPreview.industryIds)
                updateScenarioField(activeAiScenarioId, "professionIds", aiGeneratedPreview.professionIds)
                updateScenarioField(activeAiScenarioId, "difficulty", aiGeneratedPreview.difficulty)
                updateScenarioField(activeAiScenarioId, "background", aiGeneratedPreview.background)
                updateScenarioField(activeAiScenarioId, "coverImage", aiGeneratedPreview.coverImage)
                setIsAiGeneratedPreviewOpen(false)
                setAiGeneratedPreview(null)
                setAiRegenerateCount(0)
                setActiveAiScenarioId("")
              }}
            >
              <Check className="h-4 w-4" />
              确认应用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Chain Regenerate Dialog */}
      <Dialog open={taskRegenDialogOpen} onOpenChange={setTaskRegenDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>重新生成任务链</DialogTitle>
            <DialogDescription>
              请描述您对任务链的调整方向和要求，AI 将据此重新生成
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              value={taskRegenFeedback}
              onChange={(e) => setTaskRegenFeedback(e.target.value)}
              placeholder="例如：增加一个性能优化相关的任务，减少前端开发任务的比重..."
              rows={4}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setTaskRegenDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 gap-1"
              onClick={handleConfirmTaskRegen}
            >
              <Sparkles className="h-4 w-4" />
              确认重新生成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Co-builder Dialog */}
      <Dialog open={isCoBuilderDialogOpen} onOpenChange={setIsCoBuilderDialogOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div>
              <DialogTitle>选择共建人/共建部门</DialogTitle>
              <DialogDescription>
                从组织架构中选择共建人，选中的用户将参与该场景的建设
              </DialogDescription>
            </div>
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
                                    (scenarioForms[activeCoBuilderScenarioId]?.coBuilderIds || []).includes(user.id) && "bg-primary/5 text-primary"
                                  )}
                                >
                                  <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                                    (scenarioForms[activeCoBuilderScenarioId]?.coBuilderIds || []).includes(user.id) ? "bg-primary border-primary" : "border-gray-300"
                                  )}>
                                    {(scenarioForms[activeCoBuilderScenarioId]?.coBuilderIds || []).includes(user.id) && (
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
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {(scenarioForms[activeCoBuilderScenarioId]?.coBuilderIds || []).length}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {(scenarioForms[activeCoBuilderScenarioId]?.coBuilderIds || []).length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <UserPlus className="h-8 w-8 mb-2" />
                        <span className="text-sm">从左侧面板选择共建人</span>
                      </div>
                    )}
                    {(scenarioForms[activeCoBuilderScenarioId]?.coBuilderIds || []).map((userId) => {
                      const user = allTeachers.find(t => t.id === userId)
                      if (!user) return null
                      return (
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
                      )
                    })}
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
  )
}

// ------------------------------------------------------------------
// Task Table (expandable rows)
// ------------------------------------------------------------------

const BUTTON_KEYS = [
  "生成配置任务说明",
  "生成关联知识点",
  "生成关联能力点",
  "生成关联任务资源",
  "生成配置任务测评形式",
]

function TaskTable({
  scenarioId,
  tasks,
  generatedState,
  onGenerate,
  onOpenDetail,
  disabled,
}: {
  scenarioId: string
  tasks: typeof MOCK_TASKS
  generatedState: Record<string, Record<string, boolean>>
  onGenerate: (scenarioId: string, taskId: string, key: string) => void
  onOpenDetail: (scenarioId: string, taskId: string, key: string) => void
  disabled?: boolean
}) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [loadingButton, setLoadingButton] = useState<string | null>(null)

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId))
  }

  const handleClickButton = (taskId: string, key: string) => {
    const state = generatedState[taskId]?.[key]
    if (state) return // already generated
    const btnKey = `${taskId}-${key}`
    setLoadingButton(btnKey)
    onGenerate(scenarioId, taskId, key)
    setTimeout(() => {
      setLoadingButton((prev) => (prev === btnKey ? null : prev))
    }, 800)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead>任务名称</TableHead>
          <TableHead>任务类型</TableHead>
          <TableHead>预估学时</TableHead>
          <TableHead>难度</TableHead>
          <TableHead>背景</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => {
          const isExpanded = expandedTaskId === task.id
          return (
            <>
              <TableRow
                key={task.id}
                className="cursor-pointer"
                onClick={() => toggleExpand(task.id)}
              >
                <TableCell>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </TableCell>
                <TableCell className="font-medium text-sm">
                  {task.name}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={task.type === "考核" ? "default" : "secondary"}
                  >
                    {task.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{task.hours}h</TableCell>
                <TableCell>
                  <StarRating level={task.difficulty} />
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-gray-600">
                  {task.background}
                </TableCell>
              </TableRow>

              {isExpanded && (
                <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
                  <TableCell colSpan={6} className="p-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        {BUTTON_KEYS.map((key) => {
                          const generated =
                            generatedState[task.id]?.[key] ?? false
                          const isLoading =
                            loadingButton === `${task.id}-${key}`
                          return (
                            <div
                              key={key}
                              className="flex flex-col items-start gap-1"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className={cn(
                                  generated &&
                                    "border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                                )}
                                disabled={disabled || isLoading}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleClickButton(task.id, key)
                                }}
                              >
                                {isLoading ? (
                                  <>
                                    <span className="animate-spin mr-1 h-3 w-3 border-2 border-current border-t-transparent rounded-full inline-block" />
                                    生成中
                                  </>
                                ) : generated ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 mr-1" />
                                    {key.replace("生成", "")}
                                    已生成
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                                    {key}
                                  </>
                                )}
                              </Button>
                              {generated && (
                                <button
                                  className="text-xs text-purple-600 hover:underline ml-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onOpenDetail(scenarioId, task.id, key)
                                  }}
                                >
                                  查看详情
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )
        })}
      </TableBody>
    </Table>
  )
}
