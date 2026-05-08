"use client"

import { AlertCircle, BarChart3, CheckCircle, Clock, FileText, Layers, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { dashboardStats, todoItems, approvalItems } from "@/lib/mock-data"
import { PrdAnnotation } from "@/components/prd-annotation"
import { getAnnotation } from "@/lib/prd-annotations"

export default function DashboardPage() {
  // Filter todo items by type
  const rejectedDrafts = todoItems.filter(t => t.type === "rejected_draft")
  const pendingApprovals = todoItems.filter(t => t.type === "pending_approval")

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <PrdAnnotation data={getAnnotation("dashboard-title")}>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">数据统计工作台</h1>
          <p className="text-sm text-gray-500 mt-1">全局数据概览与待办中心</p>
        </div>
      </PrdAnnotation>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">累计上架场景</p>
                <p className="text-3xl font-semibold text-gray-800 mt-1">{dashboardStats.totalScenarios}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Layers className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600">+12</span>
              <span className="text-gray-400">较上月</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已发布</p>
                <p className="text-3xl font-semibold text-green-600 mt-1">{dashboardStats.publishedScenarios}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <Progress value={(dashboardStats.publishedScenarios / dashboardStats.totalScenarios) * 100} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">草稿中</p>
                <p className="text-3xl font-semibold text-gray-600 mt-1">{dashboardStats.draftScenarios}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-3">含 {rejectedDrafts.length} 个待修改</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待审批</p>
                <p className="text-3xl font-semibold text-yellow-600 mt-1">{dashboardStats.pendingScenarios}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              <Link href="/approvals" className="text-primary hover:underline">
                进入审批中心
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column: Charts */}
        <div className="col-span-2 space-y-6">
          {/* Department distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                院系场景分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.departmentDistribution.map((dept) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{dept.name}</span>
                      <span className="text-gray-500">{dept.count} 个场景 ({dept.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coverage stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">实操资源覆盖率</CardTitle>
                <CardDescription>已配置学习资源的场景占比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${dashboardStats.resourceCoverage}, 100`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-800">{dashboardStats.resourceCoverage}%</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>建议：提升至 90% 以上</p>
                    <p className="mt-1 text-primary">差 {(90 - dashboardStats.resourceCoverage).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  能力点映射完整度
                </CardTitle>
                <CardDescription>任务点关联底层能力点的比例</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24">
                    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${dashboardStats.abilityMappingCompleteness}, 100`}
                        className="text-amber-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-800">{dashboardStats.abilityMappingCompleteness}%</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>建议：提升至 80% 以上</p>
                    <p className="mt-1 text-amber-600">差 {(80 - dashboardStats.abilityMappingCompleteness).toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right column: Todo center */}
        <div className="space-y-6">
          {/* Builder view: Rejected drafts */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  被驳回待修改
                </CardTitle>
                <Badge variant="secondary" className="bg-red-50 text-red-600">
                  {rejectedDrafts.length}
                </Badge>
              </div>
              <CardDescription>建设者视图</CardDescription>
            </CardHeader>
            <CardContent>
              {rejectedDrafts.length > 0 ? (
                <div className="space-y-3">
                  {rejectedDrafts.map((item) => (
                    <Link 
                      key={item.id}
                      href={`/scenarios/${item.scenarioId}`}
                      className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{item.createdAt}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">暂无待修改项</p>
              )}
            </CardContent>
          </Card>

          {/* Reviewer view: Pending approvals */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  待审批场景
                </CardTitle>
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-600">
                  {approvalItems.filter(a => a.status === "pending").length}
                </Badge>
              </div>
              <CardDescription>审核者视图</CardDescription>
            </CardHeader>
            <CardContent>
              {approvalItems.filter(a => a.status === "pending").length > 0 ? (
                <div className="space-y-3">
                  {approvalItems.filter(a => a.status === "pending").map((item) => (
                    <Link 
                      key={item.id}
                      href={`/approvals`}
                      className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-medium text-gray-800 text-sm">{item.scenarioName}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.batchName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">提交人: {item.submitterName}</span>
                        <Badge variant="outline" className="text-xs">
                          步骤 {item.currentStep}/{item.totalSteps}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">暂无待审批项</p>
              )}
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link href="/approvals">查看全部</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
