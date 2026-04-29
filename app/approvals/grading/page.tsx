"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  PenLine,
  Search,
} from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { studentSubmissions, students, assessmentFormConfig } from "@/lib/mock-data"
import type { StudentSubmission } from "@/lib/mock-data"

const statusConfig = {
  pending: { label: "待评分", className: "bg-amber-50 text-amber-600 border-amber-200" },
  graded: { label: "已评分", className: "bg-green-50 text-green-600 border-green-200" },
}

const typeConfig = {
  objective: { label: "客观题", className: "bg-blue-50 text-blue-600 border-blue-200" },
  subjective: { label: "主观题", className: "bg-purple-50 text-purple-600 border-purple-200" },
  mixed: { label: "混合", className: "bg-indigo-50 text-indigo-600 border-indigo-200" },
}

export default function GradingPage() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(studentSubmissions)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterForm, setFilterForm] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const pendingItems = submissions.filter((s) => s.status === "pending")
  const gradedItems = submissions.filter((s) => s.status === "graded")

  const getStudentName = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.name || "未知学生"
  }

  const getStudentNumber = (studentId: string) => {
    return students.find((s) => s.id === studentId)?.studentNumber || "-"
  }

  const filterItems = (items: StudentSubmission[]) => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        getStudentName(item.studentId).includes(searchQuery) ||
        getStudentNumber(item.studentId).includes(searchQuery) ||
        item.scenarioName.includes(searchQuery) ||
        item.taskName.includes(searchQuery)
      const matchesForm = filterForm === "all" || item.assessmentForm === filterForm
      const matchesType = filterType === "all" || item.assessmentType === filterType
      return matchesSearch && matchesForm && matchesType
    })
  }

  const renderTable = (items: StudentSubmission[], emptyTitle: string, emptyDesc: string) => {
    const filtered = filterItems(items)
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                提交记录列表
              </CardTitle>
              <CardDescription>共 {filtered.length} 条记录</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索学生、场景或任务..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterForm} onValueChange={setFilterForm}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="测评形式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部形式</SelectItem>
                  <SelectItem value="试卷">试卷</SelectItem>
                  <SelectItem value="题库">题库</SelectItem>
                  <SelectItem value="评审">评审</SelectItem>
                  <SelectItem value="现场问答">现场问答</SelectItem>
                  <SelectItem value="混合测评">混合测评</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="题型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部题型</SelectItem>
                  <SelectItem value="objective">客观题</SelectItem>
                  <SelectItem value="subjective">主观题</SelectItem>
                  <SelectItem value="mixed">混合</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-medium text-slate-500 whitespace-nowrap">学生姓名</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 whitespace-nowrap">学号</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 whitespace-nowrap">场景名称</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 whitespace-nowrap">任务名称</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 text-center whitespace-nowrap">测评形式</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 text-center whitespace-nowrap">题型</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 whitespace-nowrap">提交时间</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 text-center whitespace-nowrap">状态</TableHead>
                  <TableHead className="text-xs font-medium text-slate-500 text-right whitespace-nowrap sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                      <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">{emptyTitle}</h3>
                      <p className="text-sm text-gray-500 mt-1">{emptyDesc}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          {getStudentName(item.studentId)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                        {getStudentNumber(item.studentId)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap max-w-[180px] truncate">
                        {item.scenarioName}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                        {item.taskName}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {item.assessmentForm}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <Badge variant="outline" className={typeConfig[item.assessmentType].className}>
                          {typeConfig[item.assessmentType].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {item.submittedAt}
                        </div>
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <Badge variant="outline" className={statusConfig[item.status].className}>
                          {statusConfig[item.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap sticky right-0 bg-white z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/approvals/grading/${item.id}`}>
                              <Eye className="mr-1 h-3 w-3" />
                              查看
                            </Link>
                          </Button>
                          {item.status === "pending" && (
                            <Button size="sm" asChild>
                              <Link href={`/approvals/grading/${item.id}`}>
                                <PenLine className="mr-1 h-3 w-3" />
                                去评分
                              </Link>
                            </Button>
                          )}
                          {item.status === "graded" && (
                            <Button variant="ghost" size="sm" className="text-green-600" disabled>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              已评分
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">学生评分管理</h1>
        <p className="text-sm text-gray-500 mt-1">对学生任务提交进行评分，支持客观题自动判分与主观题维度评分</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            待评分
            {pendingItems.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-amber-100 text-amber-700">
                {pendingItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="graded">已评分</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {renderTable(
            pendingItems,
            "暂无待评分提交",
            "所有学生提交都已评分完毕"
          )}
        </TabsContent>

        <TabsContent value="graded" className="mt-6">
          {renderTable(
            gradedItems,
            "暂无已评分记录",
            "完成评分后将在此显示"
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
