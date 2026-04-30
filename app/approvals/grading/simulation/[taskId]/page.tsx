"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  BookOpenCheck,
  ClipboardList,
  Database,
  FileQuestion,
  Gavel,
  GraduationCap,
  PenLine,
  Target,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Bookmark,
  BookMarked,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { studentSubmissions } from "@/lib/mock-data"
import type { LocalSubmission, TaskPhase, SimulatedTask, AssessmentForm } from "../components/types"
import { simulatedTasksMap, paperQuestions, questionBankQuestions } from "../components/task-data"
import { LearningFloat } from "../components/learning-float"
import { ExamPanel } from "../components/exam-panel"
import { ReviewSubmitPanel } from "../components/review-submit"
import { OnSiteQAPanel } from "../components/onsite-qa"
import { SubmissionSuccess } from "../components/submission-success"

const formIcons: Record<string, React.ReactNode> = {
  paper: <ClipboardList className="h-4 w-4" />,
  question_bank: <Database className="h-4 w-4" />,
  random_draw: <FileQuestion className="h-4 w-4" />,
  review: <Gavel className="h-4 w-4" />,
}

const formLabels: Record<string, string> = {
  paper: "试卷",
  question_bank: "题库",
  random_draw: "现场问答",
  review: "评审",
}

const formColors: Record<string, string> = {
  paper: "bg-green-50 text-green-600 border-green-200",
  question_bank: "bg-orange-50 text-orange-600 border-orange-200",
  random_draw: "bg-blue-50 text-blue-600 border-blue-200",
  review: "bg-purple-50 text-purple-600 border-purple-200",
}

const ASSESSMENT_SEQUENCE: AssessmentForm[] = ["paper", "question_bank", "review", "random_draw"]

// ============================================================================
// 方案 A：先学后测 - 学习阶段主界面（大卡片任务说明书）
// ============================================================================
function LearningPhaseView({
  task,
  onStartAssessment,
}: {
  task: SimulatedTask
  onStartAssessment: () => void
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 任务说明书大卡片 */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">任务说明书</CardTitle>
          </div>
          <p className="text-sm text-gray-500">请仔细阅读以下任务说明，理解任务目标和要求</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 任务背景 */}
          <div className="bg-blue-50/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-800">任务背景</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{task.background}</p>
          </div>

          {/* 任务目标 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">任务目标与要求</span>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-4">
              {task.detailedDescription}
            </div>
          </div>

          {/* 测评信息 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {task.assessmentForm === "paper" && task.paperConfig && (
              <>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <ClipboardList className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">考试时长</div>
                    <div className="text-sm font-medium">{task.paperConfig.duration} 分钟</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">及格分数</div>
                    <div className="text-sm font-medium">{task.paperConfig.passScore} 分</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">允许重考</div>
                    <div className="text-sm font-medium">{task.paperConfig.allowRetake ? "是" : "否"}</div>
                  </div>
                </div>
              </>
            )}
            {task.assessmentForm === "question_bank" && task.questionBankConfig && (
              <>
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <ClipboardList className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">答题时长</div>
                    <div className="text-sm font-medium">{task.questionBankConfig.duration} 分钟</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <Bookmark className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">题目数量</div>
                    <div className="text-sm font-medium">{task.questionBankConfig.questionCount} 题</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">总分</div>
                    <div className="text-sm font-medium">{task.questionBankConfig.totalScore} 分</div>
                  </div>
                </div>
              </>
            )}
            {task.assessmentForm === "random_draw" && (
              <>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <FileQuestion className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">测评形式</div>
                    <div className="text-sm font-medium">教师现场提问</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">测评主体</div>
                    <div className="text-sm font-medium">指导教师</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">注意事项</div>
                    <div className="text-sm font-medium">提前预约时间</div>
                  </div>
                </div>
              </>
            )}
            {task.assessmentForm === "review" && task.reviewConfig && (
              <>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Gavel className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-xs text-gray-500">评审方式</div>
                    <div className="text-sm font-medium">多维度评审</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Bookmark className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-xs text-gray-500">截止时间</div>
                    <div className="text-sm font-medium">{task.reviewConfig.deadlineDays} 天内</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-xs text-gray-500">允许重提交</div>
                    <div className="text-sm font-medium">{task.reviewConfig.allowResubmit ? "是" : "否"}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 底部开始测评按钮 */}
      <div className="flex justify-center pb-8">
        <Button size="lg" onClick={onStartAssessment} className="gap-2 px-8">
          <PenLine className="h-5 w-5" />
          我已阅读任务说明，开始测评
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// 方案 B：学测一体 - 左右分栏布局（等宽铺满）
// ============================================================================
function IntegratedLayout({
  task,
  activeForms,
  assessmentPanels,
}: {
  task: SimulatedTask
  activeForms: AssessmentForm[]
  assessmentPanels: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 左侧：任务说明书 */}
      <div className="space-y-4">
        <Card className="border-l-4 border-l-emerald-500 h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base">任务说明书</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-emerald-50/50 rounded-lg p-3">
              <div className="text-xs font-medium text-emerald-700 mb-1">任务背景</div>
              <p className="text-sm text-gray-700 leading-relaxed">{task.background}</p>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">任务目标与要求</div>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-3 max-h-[400px] overflow-y-auto">
                {task.detailedDescription}
              </div>
            </div>
            {/* 测评信息 */}
            <div className="space-y-2">
              {activeForms.includes("paper") && task.paperConfig && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <ClipboardList className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">考试时长</div>
                      <div className="text-xs font-medium">{task.paperConfig.duration} 分钟</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">及格分数</div>
                      <div className="text-xs font-medium">{task.paperConfig.passScore} 分</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">允许重考</div>
                      <div className="text-xs font-medium">{task.paperConfig.allowRetake ? "是" : "否"}</div>
                    </div>
                  </div>
                </div>
              )}
              {activeForms.includes("question_bank") && task.questionBankConfig && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <ClipboardList className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">答题时长</div>
                      <div className="text-xs font-medium">{task.questionBankConfig.duration} 分钟</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <Bookmark className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">题目数量</div>
                      <div className="text-xs font-medium">{task.questionBankConfig.questionCount} 题</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">总分</div>
                      <div className="text-xs font-medium">{task.questionBankConfig.totalScore} 分</div>
                    </div>
                  </div>
                </div>
              )}
              {activeForms.includes("random_draw") && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <FileQuestion className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">测评形式</div>
                      <div className="text-xs font-medium">教师现场提问</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">测评主体</div>
                      <div className="text-xs font-medium">指导教师</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">注意事项</div>
                      <div className="text-xs font-medium">提前预约时间</div>
                    </div>
                  </div>
                </div>
              )}
              {activeForms.includes("review") && task.reviewConfig && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <Gavel className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">评审方式</div>
                      <div className="text-xs font-medium">多维度评审</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <Bookmark className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">截止时间</div>
                      <div className="text-xs font-medium">{task.reviewConfig.deadlineDays} 天内</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="text-[10px] text-gray-500">允许重提交</div>
                      <div className="text-xs font-medium">{task.reviewConfig.allowResubmit ? "是" : "否"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 右侧：测评内容 */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {assessmentPanels}
      </div>
    </div>
  )
}

// ============================================================================
// 主页面组件
// ============================================================================
function SimulationTaskInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const taskId = params.taskId as string
  const mode = searchParams.get("mode") as "separate" | "integrated" | null
  const embedded = searchParams.get("embedded") === "1"
  const task = simulatedTasksMap[taskId]

  const methodsParam = searchParams.get("methods")
  const parsedForms = methodsParam
    ? methodsParam.split(",").filter((m): m is AssessmentForm => ASSESSMENT_SEQUENCE.includes(m as AssessmentForm))
    : []
  const activeForms = parsedForms.length > 0 ? parsedForms : ASSESSMENT_SEQUENCE.slice(0, 1)
  const totalSteps = activeForms.length

  const [taskPhase, setTaskPhase] = useState<TaskPhase>(mode === "integrated" ? "assessment" : "learning")
  const [submission, setSubmission] = useState<LocalSubmission | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [submittedForms, setSubmittedForms] = useState<Set<string>>(new Set())

  const currentForm = activeForms[currentStep]

  useEffect(() => {
    setTaskPhase(mode === "integrated" ? "assessment" : "learning")
    setCurrentStep(0)
    setSubmittedForms(new Set())
  }, [mode])

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-xl font-medium text-gray-700">任务不存在</h1>
        <p className="text-sm text-gray-500 mt-2">请返回任务列表选择有效的模拟任务</p>
        <Button className="mt-4" asChild>
          <Link href="/approvals/grading/simulation">返回列表</Link>
        </Button>
      </div>
    )
  }

  const handleStartAssessment = () => {
    setTaskPhase("assessment")
    setCurrentStep(0)
    setSubmittedForms(new Set())
  }

  const handleSubmit = (sub: LocalSubmission) => {
    setSubmission(sub)
    try {
      ;(studentSubmissions as any).push(sub)
    } catch {
      // ignore
    }
    setTaskPhase("submitted")
  }

  const handleStepSubmit = (form: AssessmentForm, sub: LocalSubmission) => {
    const nextSubmitted = new Set([...submittedForms, form])
    setSubmittedForms(nextSubmitted)
    setSubmission(sub)
    try {
      ;(studentSubmissions as any).push(sub)
    } catch {
      // ignore
    }
    if (nextSubmitted.size >= activeForms.length) {
      setTaskPhase("submitted")
    }
  }

  const renderAssessmentPanel = (form: AssessmentForm, onStepSubmit?: (sub: LocalSubmission) => void) => {
    const submitHandler = onStepSubmit || handleSubmit
    switch (form) {
      case "paper":
        return (
          <ExamPanel
            questions={paperQuestions}
            duration={task.paperConfig?.duration || 60}
            taskName={task.name}
            assessmentForm="试卷"
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      case "question_bank":
        return (
          <ExamPanel
            questions={questionBankQuestions}
            duration={task.questionBankConfig?.duration || 45}
            taskName={task.name}
            assessmentForm="题库"
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      case "review":
        return (
          <ReviewSubmitPanel
            task={task}
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      case "random_draw":
        return (
          <OnSiteQAPanel
            task={task}
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 pb-20 ${mode === "integrated" ? (embedded ? "px-6" : "") : "max-w-6xl mx-auto"} ${embedded ? "pt-16" : ""}`}>
      {embedded && (
        <button
          onClick={() => window.top.postMessage({ type: "exit-simulation" }, "*")}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-full text-sm backdrop-blur-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          返回任务列表
        </button>
      )}
      {!embedded && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/approvals/grading/simulation">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回任务列表
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span>学生端任务学习模拟</span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline" className="text-xs">
            {mode === "separate" ? "方案 A：先学后测" : "方案 B：学测一体"}
          </Badge>
        </div>
      )}

      {/* 任务标题 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={formColors[task.assessmentForm]}>
              {formIcons[task.assessmentForm]}
              <span className="ml-1">{formLabels[task.assessmentForm]}</span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />
              {task.scenarioName}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {mode === "separate" ? (
                <>
                  <BookOpenCheck className="h-3 w-3 mr-1 text-blue-500" />
                  先学后测
                </>
              ) : (
                <>
                  <BookMarked className="h-3 w-3 mr-1 text-emerald-500" />
                  学测一体
                </>
              )}
            </Badge>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">{task.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        </div>
      </div>

      {/* 阶段指示条 */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            taskPhase === "learning"
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "bg-gray-50 text-gray-400 border border-gray-200"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          学习阶段
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            taskPhase === "assessment"
              ? "bg-amber-50 text-amber-600 border border-amber-200"
              : taskPhase === "submitted"
              ? "bg-gray-50 text-gray-400 border border-gray-200"
              : "bg-gray-50 text-gray-400 border border-gray-200"
          }`}
        >
          <PenLine className="h-3.5 w-3.5" />
          测评阶段
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            taskPhase === "submitted"
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-gray-50 text-gray-400 border border-gray-200"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          已提交
        </div>
      </div>

      {/* 主内容 */}
      {mode === "separate" ? (
        // 方案 A：先学后测
        <>
          {taskPhase === "learning" && (
            <LearningPhaseView task={task} onStartAssessment={handleStartAssessment} />
          )}
          {taskPhase === "assessment" && (
            <>
              {/* 环节步骤指示器 */}
              {totalSteps > 1 && (
                <div className="flex items-center gap-3 mb-4">
                  {activeForms.map((form, idx) => {
                    const isSubmitted = submittedForms.has(form)
                    const isCurrent = idx === currentStep
                    return (
                      <button
                        key={form}
                        onClick={() => setCurrentStep(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-amber-50 text-amber-600 border border-amber-200 ring-2 ring-amber-100"
                            : isSubmitted
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isSubmitted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                        )}
                        {formLabels[form]}
                      </button>
                    )
                  })}
                </div>
              )}
              {currentForm && (
                <div key={currentForm + "-" + currentStep}>
                  {submittedForms.has(currentForm) ? (
                    <Card className="border-green-200 bg-green-50/30">
                      <CardContent className="pt-6 pb-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-green-700">{formLabels[currentForm]}测评 已完成</h3>
                          <p className="text-sm text-gray-500 mt-1">您可以切换到其他测评环节继续完成</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    renderAssessmentPanel(currentForm, (sub) => handleStepSubmit(currentForm, sub))
                  )}
                </div>
              )}
            </>
          )}
          {taskPhase === "submitted" && submission && (
            <SubmissionSuccess taskName={task.name} assessmentForm={formLabels[currentForm || task.assessmentForm]} />
          )}
          {/* 学习助手默认展开 */}
          <LearningFloat task={task} defaultExpanded={true} />
        </>
      ) : (
        // 方案 B：学测一体 - 左右分栏
        <>
          {taskPhase === "assessment" && (
            <IntegratedLayout
              task={task}
              activeForms={activeForms}
              assessmentPanels={activeForms.map((form) => (
                <div key={form} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={formColors[form]}>
                      {formIcons[form]}
                      <span className="ml-1">{formLabels[form]}</span>
                    </Badge>
                  </div>
                  {renderAssessmentPanel(form, (sub) => {
                    setSubmittedForms(prev => new Set([...prev, form]))
                    setSubmission(sub)
                    try { ;(studentSubmissions as any).push(sub) } catch {}
                    const nextSubmitted = new Set([...submittedForms, form])
                    if (nextSubmitted.size >= activeForms.length) {
                      setTaskPhase("submitted")
                    }
                  })}
                </div>
              ))}
            />
          )}
          {taskPhase === "submitted" && submission && (
            <SubmissionSuccess taskName={task.name} assessmentForm="综合测评" />
          )}
          {/* 学习助手 */}
          <LearningFloat task={task} defaultExpanded={false} />
        </>
      )}
    </div>
  )
}

export default function SimulationTaskPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto py-12 text-center">加载中...</div>}>
      <SimulationTaskInner />
    </Suspense>
  )
}
