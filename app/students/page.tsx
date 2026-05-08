"use client"

import { ChevronRight, GraduationCap, Search, User } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { students, studentScenarioScores, studentAbilityScores, getAbilityLevel, getAbilityLevelLabel, getAbilityLevelColor } from "@/lib/mock-data"
import { PrdAnnotation } from "@/components/prd-annotation"
import { getAnnotation } from "@/lib/prd-annotations"

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const departments = useMemo(() => {
    const depts = [...new Set(students.map(s => s.department))]
    return depts
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.includes(searchQuery) || 
                           student.studentNumber.includes(searchQuery) ||
                           student.class.includes(searchQuery)
      const matchesDept = departmentFilter === "all" || student.department === departmentFilter
      return matchesSearch && matchesDept
    })
  }, [searchQuery, departmentFilter])

  const getStudentStats = (studentId: string) => {
    const scores = studentScenarioScores.filter(s => s.studentId === studentId)
    const abilities = studentAbilityScores.filter(s => s.studentId === studentId)
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length)
      : 0
    return {
      scenarioCount: scores.length,
      avgScore,
      abilityCount: abilities.length,
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PrdAnnotation data={getAnnotation("students-title")}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学生能力报告</h1>
          <p className="text-gray-500 mt-1">查看学生的场景学习成绩和岗位胜任度分析</p>
        </div>
      </PrdAnnotation>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <PrdAnnotation data={getAnnotation("students-search")} className="flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索学生姓名、学号或班级..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </PrdAnnotation>
        <PrdAnnotation data={getAnnotation("students-dept")}>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="筛选院系" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部院系</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PrdAnnotation>
      </div>

      {/* Student Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <PrdAnnotation data={getAnnotation("students-stat-total")}>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-gray-500">学生总数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PrdAnnotation>
        <PrdAnnotation data={getAnnotation("students-stat-scenarios")}>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentScenarioScores.length}</p>
                  <p className="text-sm text-gray-500">完成场景数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PrdAnnotation>
        <PrdAnnotation data={getAnnotation("students-stat-score")}>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(studentScenarioScores.reduce((sum, s) => sum + s.totalScore, 0) / (studentScenarioScores.length || 1))}
                  </p>
                  <p className="text-sm text-gray-500">平均得分</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PrdAnnotation>
        <PrdAnnotation data={getAnnotation("students-stat-abilities")}>
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentAbilityScores.length}</p>
                  <p className="text-sm text-gray-500">能力点评估</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PrdAnnotation>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">学生列表</CardTitle>
          <CardDescription>共 {filteredStudents.length} 名学生</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredStudents.map(student => {
              const stats = getStudentStats(student.id)
              const abilities = studentAbilityScores.filter(s => s.studentId === student.id)
              
              return (
                <Link
                  key={student.id}
                  href={`/students/${student.id}/competency`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {student.name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{student.name}</span>
                      <span className="text-sm text-gray-400">{student.studentNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{student.class}</span>
                      <span className="text-gray-300">|</span>
                      <span>{student.department}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{stats.scenarioCount}</p>
                      <p className="text-xs text-gray-400">已完成场景</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("text-lg font-bold", stats.avgScore >= 80 ? "text-green-600" : stats.avgScore >= 60 ? "text-blue-600" : "text-red-600")}>
                        {stats.avgScore || "-"}
                      </p>
                      <p className="text-xs text-gray-400">平均得分</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {abilities.slice(0, 3).map(ability => (
                        <Badge key={ability.abilityId} variant="outline" className="text-xs">
                          {ability.abilityName.substring(0, 4)}
                        </Badge>
                      ))}
                      {abilities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{abilities.length - 3}</Badge>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
