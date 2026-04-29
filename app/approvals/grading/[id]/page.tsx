"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Package,
  Save,
  Star,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { studentSubmissions, students, scenarios, defaultRubricLevels } from "@/lib/mock-data"
import type {
  StudentSubmission,
  ObjectiveSubmissionAnswer,
  RubricScoreRecord,
  RubricLevel,
} from "@/lib/mock-data"

// ============================================================================
// 辅助函数
// ============================================================================

function getStudent(studentId: string) {
  return students.find((s) => s.id === studentId)
}

function getScenario(scenarioId: string) {
  return scenarios.find((s) => s.id === scenarioId)
}

function getTaskRubricPoints(scenarioId: string, taskId: string) {
  const scenario = getScenario(scenarioId)
  if (!scenario) return []
  const task = scenario.tasks.find((t) => t.id === taskId)
  if (!task || !task.assessment) return []

  const rubricPoints: {
    id: string
    name: string
    weight: number
    maxScore: number
    levels: RubricLevel[]
  }[] = []

  if (task.assessment.subjectiveConfig) {
    rubricPoints.push(...task.assessment.subjectiveConfig.rubricPoints)
  }
  if (task.assessment.mixedWeights && task.assessment.subjectiveConfig) {
    rubricPoints.length = 0
    rubricPoints.push(...task.assessment.subjectiveConfig.rubricPoints)
  }

  return rubricPoints
}

function getObjectiveMaxScore(scenarioId: string, taskId: string) {
  const scenario = getScenario(scenarioId)
  if (!scenario) return 0
  const task = scenario.tasks.find((t) => t.id === taskId)
  if (!task || !task.assessment) return 0

  if (task.assessment.objectiveConfig) {
    return task.assessment.objectiveConfig.totalScore
  }
  if (task.assessment.mixedWeights && task.assessment.objectiveConfig) {
    return task.assessment.objectiveConfig.totalScore
  }
  return 0
}

function getSubjectiveMaxScore(scenarioId: string, taskId: string) {
  const scenario = getScenario(scenarioId)
  if (!scenario) return 0
  const task = scenario.tasks.find((t) => t.id === taskId)
  if (!task || !task.assessment) return 0

  if (task.assessment.subjectiveConfig) {
    return task.assessment.subjectiveConfig.totalScore
  }
  if (task.assessment.mixedWeights && task.assessment.subjectiveConfig) {
    return task.assessment.subjectiveConfig.totalScore
  }
  return 0
}

function getMixedWeights(scenarioId: string, taskId: string) {
  const scenario = getScenario(scenarioId)
  if (!scenario) return null
  const task = scenario.tasks.find((t) => t.id === taskId)
  if (!task || !task.assessment) return null
  return task.assessment.mixedWeights || null
}

function getLevelColor(levelName: string): string {
  const colorMap: Record<string, string> = {
    优秀: "bg-green-500",
    良好: "bg-blue-500",
    及格: "bg-yellow-500",
    不合格: "bg-red-500",
  }
  return colorMap[levelName] || "bg-gray-400"
}

function getLevelTextColor(levelName: string): string {
  const colorMap: Record<string, string> = {
    优秀: "text-green-700 bg-green-50 border-green-200",
    良好: "text-blue-700 bg-blue-50 border-blue-200",
    及格: "text-yellow-700 bg-yellow-50 border-yellow-200",
    不合格: "text-red-700 bg-red-50 border-red-200",
  }
  return colorMap[levelName] || "text-gray-700 bg-gray-50 border-gray-200"
}

// ============================================================================
// 客观题评分卡片
// ============================================================================

function ObjectiveGradingCard({
  answer,
  index,
  isGraded,
  onScoreChange,
}: {
  answer: ObjectiveSubmissionAnswer
  index: number
  isGraded: boolean
  onScoreChange: (questionId: string, newScore: number) => void
}) {
  const [localScore, setLocalScore] = useState(answer.score.toString())

  const handleBlur = () => {
    const num = parseFloat(localScore)
    if (!isNaN(num) && num >= 0 && num <= answer.maxScore) {
      onScoreChange(answer.questionId, num)
    } else {
      setLocalScore(answer.score.toString())
    }
  }

  const getAnswerLabel = () => {
    if (answer.questionType === "judgment") {
      return answer.studentAnswer === "true" ? "正确" : "错误"
    }
    if (Array.isArray(answer.studentAnswer)) {
      return answer.studentAnswer.join("、")
    }
    return answer.studentAnswer
  }

  const getCorrectLabel = () => {
    if (answer.questionType === "judgment") {
      return answer.correctAnswer === "true" ? "正确" : "错误"
    }
    if (Array.isArray(answer.correctAnswer)) {
      return answer.correctAnswer.join("、")
    }
    return answer.correctAnswer
  }

  const questionTypeLabel = {
    single: "单选题",
    multiple: "多选题",
    judgment: "判断题",
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {questionTypeLabel[answer.questionType]}
              </Badge>
              <span className="text-sm font-medium text-gray-500">第 {index + 1} 题</span>
              <span className="text-xs text-gray-400">（满分 {answer.maxScore} 分）</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{answer.questionContent}</p>

            {answer.options && answer.options.length > 0 && (
              <div className="space-y-1.5 pl-1">
                {answer.options.map((opt, idx) => {
                  const optLabel = String.fromCharCode(65 + idx)
                  const isSelected =
                    Array.isArray(answer.studentAnswer)
                      ? answer.studentAnswer.includes(opt)
                      : answer.studentAnswer === opt
                  const isCorrect =
                    Array.isArray(answer.correctAnswer)
                      ? answer.correctAnswer.includes(opt)
                      : answer.correctAnswer === opt

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
                        isCorrect
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : isSelected && !isCorrect
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded text-xs font-medium ${
                          isCorrect
                            ? "bg-green-500 text-white"
                            : isSelected && !isCorrect
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {optLabel}
                      </span>
                      <span>{opt}</span>
                      {isCorrect && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-auto" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="h-3.5 w-3.5 text-red-500 ml-auto" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {!answer.options && answer.questionType === "judgment" && (
              <div className="flex items-center gap-4 pl-1">
                <div
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
                    answer.correctAnswer === "true"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : answer.studentAnswer === "true" && answer.correctAnswer !== "true"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "text-gray-600"
                  }`}
                >
                  <span>正确</span>
                  {answer.correctAnswer === "true" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  )}
                </div>
                <div
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
                    answer.correctAnswer === "false"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : answer.studentAnswer === "false" && answer.correctAnswer !== "false"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "text-gray-600"
                  }`}
                >
                  <span>错误</span>
                  {answer.correctAnswer === "false" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-1">
              <div className="text-sm">
                <span className="text-gray-500">学生答案：</span>
                <span className={answer.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {getAnswerLabel()}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">正确答案：</span>
                <span className="text-green-600 font-medium">{getCorrectLabel()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 min-w-[120px]">
            <Label className="text-xs text-gray-500">得分</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min={0}
                max={answer.maxScore}
                step={0.5}
                value={localScore}
                onChange={(e) => setLocalScore(e.target.value)}
                onBlur={handleBlur}
                disabled={isGraded}
                className="w-20 text-right h-9"
              />
              <span className="text-sm text-gray-400">/ {answer.maxScore}</span>
            </div>
            {answer.isCorrect ? (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                正确
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                <XCircle className="h-3 w-3 mr-1" />
                错误
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// 主观题 Rubric 评分卡片
// ============================================================================

function RubricGradingCard({
  rubricPoint,
  scoreRecord,
  isGraded,
  onChange,
}: {
  rubricPoint: {
    id: string
    name: string
    weight: number
    maxScore: number
    levels: RubricLevel[]
  }
  scoreRecord?: RubricScoreRecord
  isGraded: boolean
  onChange: (record: RubricScoreRecord) => void
}) {
  const [selectedLevelId, setSelectedLevelId] = useState(scoreRecord?.levelId || "")
  const [score, setScore] = useState(scoreRecord?.score?.toString() || "")
  const [comment, setComment] = useState(scoreRecord?.comment || "")

  const selectedLevel = rubricPoint.levels.find((l) => l.id === selectedLevelId)

  const handleLevelChange = (levelId: string) => {
    setSelectedLevelId(levelId)
    const level = rubricPoint.levels.find((l) => l.id === levelId)
    if (level) {
      const midScore = Math.round((level.minScore + level.maxScore) / 2)
      const clampedScore = Math.min(midScore, rubricPoint.maxScore)
      setScore(clampedScore.toString())
      onChange({
        rubricPointId: rubricPoint.id,
        rubricPointName: rubricPoint.name,
        weight: rubricPoint.weight,
        maxScore: rubricPoint.maxScore,
        levelId: level.id,
        levelName: level.name,
        score: clampedScore,
        comment,
      })
    }
  }

  const handleScoreBlur = () => {
    const num = parseFloat(score)
    if (!isNaN(num) && num >= 0 && num <= rubricPoint.maxScore) {
      onChange({
        rubricPointId: rubricPoint.id,
        rubricPointName: rubricPoint.name,
        weight: rubricPoint.weight,
        maxScore: rubricPoint.maxScore,
        levelId: selectedLevelId || undefined,
        levelName: selectedLevel?.name || undefined,
        score: num,
        comment,
      })
    }
  }

  const handleCommentBlur = () => {
    const num = parseFloat(score) || 0
    onChange({
      rubricPointId: rubricPoint.id,
      rubricPointName: rubricPoint.name,
      weight: rubricPoint.weight,
      maxScore: rubricPoint.maxScore,
      levelId: selectedLevelId || undefined,
      levelName: selectedLevel?.name || undefined,
      score: num,
      comment,
    })
  }

  return (
    <Card className="border-slate-200">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-800">{rubricPoint.name}</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              权重 {rubricPoint.weight}% · 满分 {rubricPoint.maxScore} 分
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={0}
              max={rubricPoint.maxScore}
              step={0.5}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              onBlur={handleScoreBlur}
              disabled={isGraded}
              className="w-20 text-right h-9"
            />
            <span className="text-sm text-gray-400">/ {rubricPoint.maxScore}</span>
          </div>
        </div>

        <RadioGroup
          value={selectedLevelId}
          onValueChange={handleLevelChange}
          disabled={isGraded}
          className="grid grid-cols-4 gap-2"
        >
          {rubricPoint.levels.map((level) => (
            <div key={level.id}>
              <RadioGroupItem
                value={level.id}
                id={`${rubricPoint.id}-${level.id}`}
                className="sr-only"
              />
              <Label
                htmlFor={`${rubricPoint.id}-${level.id}`}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedLevelId === level.id
                    ? `border-current ring-1 ring-current ${getLevelTextColor(level.name)}`
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${getLevelColor(level.name)}`} />
                <span className="text-sm font-medium">{level.name}</span>
                <span className="text-xs text-gray-500">
                  {level.minScore}-{level.maxScore}分
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500">评分说明/评语</Label>
          <Textarea
            placeholder={`请输入该维度的评分说明或改进建议...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={handleCommentBlur}
            disabled={isGraded}
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// 主页面
// ============================================================================

export default function GradingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const submissionId = params.id as string

  const [submission, setSubmission] = useState<StudentSubmission | undefined>(
    studentSubmissions.find((s) => s.id === submissionId)
  )

  const [objectiveAnswers, setObjectiveAnswers] = useState<ObjectiveSubmissionAnswer[]>(
    submission?.objectiveAnswers || []
  )

  const [rubricScores, setRubricScores] = useState<RubricScoreRecord[]>(
    submission?.rubricScores || []
  )

  const [teacherComment, setTeacherComment] = useState(submission?.teacherComment || "")
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!submission) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-gray-700">未找到提交记录</h2>
        <p className="text-sm text-gray-500 mt-1">该评分记录不存在或已被删除</p>
        <Button className="mt-4" asChild>
          <Link href="/approvals/grading">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Link>
        </Button>
      </div>
    )
  }

  const student = getStudent(submission.studentId)
  const scenario = getScenario(submission.scenarioId)
  const rubricPoints = getTaskRubricPoints(submission.scenarioId, submission.taskId)
  const objectiveMaxScore = getObjectiveMaxScore(submission.scenarioId, submission.taskId)
  const subjectiveMaxScore = getSubjectiveMaxScore(submission.scenarioId, submission.taskId)
  const mixedWeights = getMixedWeights(submission.scenarioId, submission.taskId)

  const isGraded = submission.status === "graded" || isSubmitted

  // 计算客观题总分
  const objectiveTotal = objectiveAnswers.reduce((sum, a) => sum + a.score, 0)

  // 计算主观题总分
  const subjectiveTotal = rubricScores.reduce((sum, r) => sum + r.score, 0)

  // 计算最终总分
  let finalTotal = 0
  if (submission.assessmentType === "objective") {
    finalTotal = objectiveTotal
  } else if (submission.assessmentType === "subjective") {
    finalTotal = subjectiveTotal
  } else if (submission.assessmentType === "mixed" && mixedWeights) {
    const objRatio = mixedWeights.objective / 100
    const subjRatio = mixedWeights.subjective / 100
    const objScore = objectiveMaxScore > 0 ? (objectiveTotal / objectiveMaxScore) * 100 : 0
    const subjScore = subjectiveMaxScore > 0 ? (subjectiveTotal / subjectiveMaxScore) * 100 : 0
    finalTotal = Math.round(objScore * objRatio + subjScore * subjRatio)
  }

  const handleObjectiveScoreChange = (questionId: string, newScore: number) => {
    setObjectiveAnswers((prev) =>
      prev.map((a) => (a.questionId === questionId ? { ...a, score: newScore } : a))
    )
  }

  const handleRubricScoreChange = (record: RubricScoreRecord) => {
    setRubricScores((prev) => {
      const existing = prev.find((r) => r.rubricPointId === record.rubricPointId)
      if (existing) {
        return prev.map((r) => (r.rubricPointId === record.rubricPointId ? record : r))
      }
      return [...prev, record]
    })
  }

  const handleSubmitGrading = () => {
    setIsSubmitted(true)
    setSubmission((prev) =>
      prev
        ? {
            ...prev,
            status: "graded",
            objectiveTotalScore: objectiveTotal,
            subjectiveTotalScore: subjectiveTotal,
            totalScore: finalTotal,
            teacherComment,
            rubricScores,
            gradedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
            gradedBy: "张老师",
          }
        : prev
    )
    setIsSubmitDialogOpen(false)
  }

  const allRubricScored =
    rubricPoints.length === 0 || rubricPoints.every((rp) => rubricScores.some((s) => s.rubricPointId === rp.id))

  const canSubmit = !isGraded && allRubricScored

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/approvals/grading">
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回列表
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800">学生任务评分</h1>
        </div>
        {isGraded && (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            已评分
          </Badge>
        )}
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <GraduationCap className="h-4 w-4" />
              学生信息
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                {student?.name?.charAt(0) || "?"}
              </div>
              <div>
                <div className="font-medium text-gray-800">{student?.name || "未知学生"}</div>
                <div className="text-xs text-gray-500">
                  学号：{student?.studentNumber || "-"} · {student?.class || "-"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-600">
              <Package className="h-4 w-4" />
              任务信息
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <div className="text-sm">
              <span className="text-gray-500">场景：</span>
              <span className="text-gray-800">{submission.scenarioName}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">任务：</span>
              <span className="text-gray-800">{submission.taskName}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">测评形式：</span>
              <Badge variant="outline" className="text-xs ml-1">
                {submission.assessmentForm}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ml-1 ${
                  submission.assessmentType === "objective"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : submission.assessmentType === "subjective"
                      ? "bg-purple-50 text-purple-600 border-purple-200"
                      : "bg-indigo-50 text-indigo-600 border-indigo-200"
                }`}
              >
                {submission.assessmentType === "objective"
                  ? "客观题"
                  : submission.assessmentType === "subjective"
                    ? "主观题"
                    : "混合"}
              </Badge>
            </div>
            <div className="text-sm flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-gray-500">提交时间：</span>
              <span className="text-gray-800">{submission.submittedAt}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 客观题评分区 */}
      {(submission.assessmentType === "objective" || submission.assessmentType === "mixed") &&
        objectiveAnswers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                客观题评分
                {mixedWeights && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                    占比 {mixedWeights.objective}%
                  </Badge>
                )}
              </h2>
              <div className="text-sm text-gray-500">
                自动得分：
                <span className="font-medium text-gray-800">
                  {objectiveTotal} / {objectiveMaxScore}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {objectiveAnswers.map((answer, idx) => (
                <ObjectiveGradingCard
                  key={answer.questionId}
                  answer={answer}
                  index={idx}
                  isGraded={isGraded}
                  onScoreChange={handleObjectiveScoreChange}
                />
              ))}
            </div>
          </div>
        )}

      {/* 主观题评分区 */}
      {(submission.assessmentType === "subjective" || submission.assessmentType === "mixed") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              主观题评分
              {mixedWeights && (
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600 border-purple-200">
                  占比 {mixedWeights.subjective}%
                </Badge>
              )}
            </h2>
            <div className="text-sm text-gray-500">
              已评分：
              <span className="font-medium text-gray-800">
                {subjectiveTotal} / {subjectiveMaxScore}
              </span>
            </div>
          </div>

          {/* 学生提交内容 */}
          {submission.subjectiveContent && (
            <Card className="border-slate-200 bg-slate-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">学生提交内容</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {submission.subjectiveContent.textAnswer && (
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {submission.subjectiveContent.textAnswer}
                    </pre>
                  </div>
                )}
                {submission.subjectiveContent.attachments &&
                  submission.subjectiveContent.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {submission.subjectiveContent.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm"
                        >
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{att.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {att.type === "code"
                              ? "代码"
                              : att.type === "video"
                                ? "视频"
                                : att.type === "document"
                                  ? "文档"
                                  : att.type === "image"
                                    ? "图片"
                                    : "其他"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

          {/* Rubric 维度评分 */}
          {rubricPoints.length > 0 ? (
            <div className="space-y-3">
              {rubricPoints.map((rp) => (
                <RubricGradingCard
                  key={rp.id}
                  rubricPoint={rp}
                  scoreRecord={rubricScores.find((s) => s.rubricPointId === rp.id)}
                  isGraded={isGraded}
                  onChange={handleRubricScoreChange}
                />
              ))}
            </div>
          ) : (
            <Card className="border-slate-200">
              <CardContent className="py-8 text-center text-gray-500">
                <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p>该任务未配置评分维度</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Separator />

      {/* 评分汇总 */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4" />
            评分汇总
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {submission.assessmentType === "objective" && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">客观题得分</div>
                <div className="text-2xl font-bold text-blue-700">
                  {objectiveTotal}
                  <span className="text-sm font-normal text-blue-500"> / {objectiveMaxScore}</span>
                </div>
              </div>
            )}
            {submission.assessmentType === "subjective" && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">主观题得分</div>
                <div className="text-2xl font-bold text-purple-700">
                  {subjectiveTotal}
                  <span className="text-sm font-normal text-purple-500"> / {subjectiveMaxScore}</span>
                </div>
              </div>
            )}
            {submission.assessmentType === "mixed" && (
              <>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">
                    客观题（{mixedWeights?.objective}%）
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {objectiveTotal}
                    <span className="text-sm font-normal text-blue-500"> / {objectiveMaxScore}</span>
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">
                    主观题（{mixedWeights?.subjective}%）
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {subjectiveTotal}
                    <span className="text-sm font-normal text-purple-500"> / {subjectiveMaxScore}</span>
                  </div>
                </div>
              </>
            )}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">最终得分</div>
              <div className="text-2xl font-bold text-green-700">
                {isGraded || finalTotal > 0 ? finalTotal : "-"}
                <span className="text-sm font-normal text-green-500"> / {submission.maxScore}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-600">教师评语</Label>
            <Textarea
              placeholder="请输入对学生本次任务表现的综合评价..."
              value={teacherComment}
              onChange={(e) => setTeacherComment(e.target.value)}
              disabled={isGraded}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {isGraded && submission.gradedAt && (
              <div className="text-sm text-gray-500 mr-auto">
                评分时间：{submission.gradedAt} · 评分教师：{submission.gradedBy}
              </div>
            )}
            <Button variant="outline" asChild>
              <Link href="/approvals/grading">取消</Link>
            </Button>
            {!isGraded && (
              <Button
                onClick={() => setIsSubmitDialogOpen(true)}
                disabled={!canSubmit}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                提交评分
              </Button>
            )}
            {isGraded && (
              <Button disabled className="gap-1 bg-green-600 hover:bg-green-600">
                <CheckCircle2 className="h-4 w-4" />
                评分已提交
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 提交确认对话框 */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认提交评分</DialogTitle>
            <DialogDescription>
              评分提交后将不可修改，请确认评分结果无误。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">学生</span>
              <span className="font-medium">{student?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">任务</span>
              <span className="font-medium">{submission.taskName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">最终得分</span>
              <span className="text-xl font-bold text-green-600">
                {finalTotal} / {submission.maxScore}
              </span>
            </div>
            {teacherComment && (
              <div className="text-sm">
                <span className="text-gray-500">评语：</span>
                <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">{teacherComment}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              再检查下
            </Button>
            <Button onClick={handleSubmitGrading}>
              确认提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
