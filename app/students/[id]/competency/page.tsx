"use client"

import { ArrowLeft, Award, BookOpen, Calendar, CheckCircle, GraduationCap, TrendingUp, User } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { 
  students, 
  studentScenarioScores, 
  studentAbilityScores, 
  positionAbilities,
  professions,
  getAbilityLevelLabel, 
  getAbilityLevelColor 
} from "@/lib/mock-data"

export default function StudentCompetencyPage() {
  const params = useParams()
  const studentId = params.id as string
  
  const student = students.find(s => s.id === studentId)
  const scenarioScores = studentScenarioScores.filter(s => s.studentId === studentId)
  const abilityScores = studentAbilityScores.filter(s => s.studentId === studentId)

  // Group abilities by position
  const abilitiesByPosition = useMemo(() => {
    const grouped: Record<string, typeof abilityScores> = {}
    abilityScores.forEach(score => {
      if (!grouped[score.positionId]) {
        grouped[score.positionId] = []
      }
      grouped[score.positionId].push(score)
    })
    return grouped
  }, [abilityScores])

  // Calculate overall competency per position
  const positionCompetency = useMemo(() => {
    const result: { positionId: string; positionName: string; competency: number; abilities: typeof abilityScores }[] = []
    
    Object.entries(abilitiesByPosition).forEach(([positionId, abilities]) => {
      const posAbilities = positionAbilities.filter(a => a.positionId === positionId)
      let totalWeightedScore = 0
      let totalWeight = 0
      
      abilities.forEach(ability => {
        const posAbility = posAbilities.find(pa => pa.id === ability.abilityId)
        if (posAbility) {
          totalWeightedScore += ability.score * posAbility.weight
          totalWeight += posAbility.weight
        }
      })
      
      const competency = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0
      const positionName = abilities[0]?.positionId ? 
        professions.flatMap(p => p.positions).find(p => p.id === positionId)?.name || "未知岗位" :
        "未知岗位"
      
      result.push({ positionId, positionName, competency, abilities })
    })
    
    return result
  }, [abilitiesByPosition])

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">学生不存在</p>
      </div>
    )
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "expert": return "bg-green-100 text-green-700 border-green-200"
      case "proficient": return "bg-blue-100 text-blue-700 border-blue-200"
      case "familiar": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "beginner": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 75) return "bg-blue-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/students">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学生能力报告</h1>
          <p className="text-gray-500">查看学生的岗位胜任度和能力评估详情</p>
        </div>
      </div>

      {/* Student Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {student.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {student.studentNumber}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {student.class}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {student.department}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {student.enrollmentYear}级
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{scenarioScores.length}</p>
                <p className="text-sm text-gray-400">完成场景</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {scenarioScores.length > 0 
                    ? Math.round(scenarioScores.reduce((sum, s) => sum + s.totalScore, 0) / scenarioScores.length)
                    : "-"
                  }
                </p>
                <p className="text-sm text-gray-400">平均得分</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{abilityScores.length}</p>
                <p className="text-sm text-gray-400">能力点</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="competency" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competency" className="gap-2">
            <Award className="h-4 w-4" />
            岗位胜任度
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="gap-2">
            <BookOpen className="h-4 w-4" />
            场景学习记录
          </TabsTrigger>
        </TabsList>

        {/* Competency Tab */}
        <TabsContent value="competency" className="space-y-6">
          {positionCompetency.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无能力评估数据</p>
                <p className="text-sm mt-1">完成场景学习后将自动生成能力评估</p>
              </CardContent>
            </Card>
          ) : (
            positionCompetency.map(({ positionId, positionName, competency, abilities }) => (
              <Card key={positionId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {positionName}
                      </CardTitle>
                      <CardDescription>岗位能力评估报告</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{competency}%</div>
                      <div className="text-sm text-gray-500">岗位胜任度</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Overall Progress */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">综合胜任度</span>
                      <span className={cn("text-sm font-bold", getScoreColor(competency))}>{competency}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all", getProgressColor(competency))}
                        style={{ width: `${competency}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>待提升</span>
                      <span>了解</span>
                      <span>熟练</span>
                      <span>精通</span>
                    </div>
                  </div>

                  {/* Ability Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">能力点详情</h4>
                    {abilities.map(ability => {
                      const posAbility = positionAbilities.find(pa => pa.id === ability.abilityId)
                      return (
                        <div key={ability.abilityId} className="p-3 border rounded-lg bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{ability.abilityName}</span>
                              <Badge variant="outline" className={cn("text-xs", getLevelBadgeColor(ability.level))}>
                                {getAbilityLevelLabel(ability.level)}
                              </Badge>
                              {posAbility && (
                                <span className="text-xs text-gray-400">权重: {posAbility.weight}%</span>
                              )}
                            </div>
                            <span className={cn("text-lg font-bold", getScoreColor(ability.score))}>
                              {ability.score}分
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full transition-all", getProgressColor(ability.score))}
                              style={{ width: `${ability.score}%` }}
                            />
                          </div>
                          {/* Scenario contributions */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {ability.scenarioContributions.map(sc => (
                              <Badge key={sc.scenarioId} variant="secondary" className="text-xs">
                                {sc.scenarioName.substring(0, 10)}... ({sc.contribution}分)
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-4">
          {scenarioScores.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无场景学习记录</p>
              </CardContent>
            </Card>
          ) : (
            scenarioScores.map(score => (
              <Card key={score.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{score.scenarioName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{score.positionName}</Badge>
                        <span className="text-gray-400">|</span>
                        <span>完成时间：{score.completedAt}</span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-2xl font-bold", getScoreColor(score.totalScore))}>
                        {score.totalScore}分
                      </div>
                      <div className="text-sm text-gray-500">总得分</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 border-t">
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">任务得分明细</h4>
                    <div className="space-y-2">
                      {score.taskScores.map((ts, index) => (
                        <div key={ts.taskId} className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs text-gray-500">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-sm text-gray-700">{ts.taskName}</span>
                          <div className="w-32">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", getProgressColor(ts.score))}
                                style={{ width: `${(ts.score / ts.maxScore) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className={cn("text-sm font-medium w-16 text-right", getScoreColor(ts.score))}>
                            {ts.score}/{ts.maxScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
